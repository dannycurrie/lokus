import audioService from './audio/audio-service.js';
import { getDistance, normalise } from './utils.js';
import visuals from './visuals/index.js';

visuals();

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

// get audio and build points
audioService().then((res) => {
  // remove loader once sounds loaded
  document.querySelector('#loader').setAttribute('hidden', true);
  document.querySelector('#loader-bg').setAttribute('hidden', true);

  addPoints(
    res.map((s) => {
      s.audio.play();
      return buildPoint(s.audio, s.key);
    })
  );
});
