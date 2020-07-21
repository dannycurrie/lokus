import audioService from './audio/audio-service.js';
import { getDistance, normalise } from './utils.js';
import visuals from './visuals/index.js';

// sounds
const {
  fromEvent,
  operators: { map, debounceTime },
} = rxjs;

const w = window.innerWidth;
const h = window.innerHeight;

const buildPoint = (sound, key) => ({
  id: key,
  sound,
  x: Math.random() * w,
  y: Math.random() * h,
});

// add points to page
const addPoints = (points) => {
  const app = document.querySelector('#app');
  points.forEach(({ x, y, id, sound }) => {
    const point = document.createElement('div');
    point.id = id;
    point.className = 'point';
    point.style.left = x;
    point.style.top = y;
    app.appendChild(point);
    // set sound pan according to x value on screen
    sound.stereo = normalise(x, w, 0);
  });

  // listen for mouse events
  const source = fromEvent(document, 'mousemove');

  const example = source.pipe(
    debounceTime(10),
    map(({ clientX, clientY }) => [clientX, clientY])
  );

  example.subscribe(([x, y]) => {
    const distances = points
      .map((sp) => [getDistance(sp.x, sp.y, x, y), sp.sound, sp.id])
      .sort((a, b) => a[0] - b[0]);

    const [max] = distances[points.length - 1];
    const [min] = distances[0];

    distances.forEach(([d, audio, id]) => {
      const vol = 1 - normalise(d, max, min);
      audio.volume(vol);
    });
  });
};

const loadingElements = [
  document.querySelector('#loader'),
  document.querySelector('#loader-bg'),
];

const showLoadingScreen = () => {
  loadingElements.forEach((el) => el.setAttribute('hidden', false));
};

const hideLoadingScreen = () => {
  loadingElements.forEach((el) => el.setAttribute('hidden', true));
};

// get audio and build points
const startAudio = () => {
  audioService().then((res) => {
    addPoints(
      res.map((s) => {
        s.audio.play();
        return buildPoint(s.audio, s.key);
      })
    );
  });
};

let started = false;

const hidePrompt = () => {
  document.querySelector('.prompt').className = 'prompt hide';
};

const showPrompt = () => {
  document.querySelector('.prompt').className = 'prompt show';
};

// on play button click, start the app
document.querySelector('.play-btn').addEventListener('click', async () => {
  if (started) return;
  showLoadingScreen();
  await startAudio();
  hideLoadingScreen();
  visuals();
  // close play button
  document.querySelector('.play-btn').className = 'close';
  started = true;
  // show then hide prompt
  showPrompt();
  setTimeout(hidePrompt, 4000);
});
