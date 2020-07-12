import audioService from './audio/audio-service.js';
import { getDistance, normalise } from './utils.js';
import glitch from './glitch.js';
import particles from './particles.js';

// visuals
const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

const drawParticles = particles(canvas, ctx);

function animloop() {
  drawParticles();
  glitch(canvas, ctx);
  requestAnimFrame(animloop);
}
animloop();

// sounds
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

// add points to page
const addPoints = (points) => {
  const app = document.querySelector('#app');
  points.forEach(({ x, y, id }) => {
    const point = document.createElement('div');
    point.id = id;
    point.className = 'point';
    point.style.left = x;
    point.style.top = y;
    app.appendChild(point);
  });

  // listen for mouse events
  const source = fromEvent(document, 'mousemove');

  const example = source.pipe(
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
  const soundPoints = res.map((s) => {
    s.audio.play();
    return buildPoint(s.audio, s.key);
  });
  addPoints(soundPoints);
});
