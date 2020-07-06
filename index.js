import audioService from './audio/audio-service.js';
import { getDistance, normalise } from './utils.js';

const {
  fromEvent,
  operators: { map },
} = rxjs;

const buildPoint = (sound, key) => ({
  id: key,
  sound,
  x: Math.random() * 1000,
  y: Math.random() * 1000,
});

const soundPoints = audioService().map((s) => {
  s.audio.play();
  return buildPoint(s.audio, s.key);
});

// add points to page
const app = document.querySelector('#app');
soundPoints.forEach(({ x, y, id }) => {
  const point = document.createElement('div');
  point.id = id;
  point.className = 'point';
  point.style.left = x;
  point.style.top = y;
  point.textContent = id;
  app.appendChild(point);
});

// listen for mouse events
const source = fromEvent(document, 'mousemove');

const example = source.pipe(map(({ clientX, clientY }) => [clientX, clientY]));

example.subscribe(([x, y]) => {
  const distances = soundPoints
    .map((sp) => [getDistance(sp.x, sp.y, x, y), sp.sound, sp.id])
    .sort((a, b) => a[0] - b[0]);

  const [max] = distances[soundPoints.length - 1];
  const [min] = distances[0];

  distances.forEach(([d, audio, id]) => {
    const vol = 1 - normalise(d, max, min);
    audio.volume(vol);
    const point = document.querySelector(`#${id}`);
    point.style.transform = `scale(${1 + vol})`;
  });
});
