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
  });
});

// particles

const fillColour = '#0fffc1';

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

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

let w = window.innerWidth,
  h = window.outerHeight * 2;
canvas.width = w;
canvas.height = h;
const colors = ['#0fffc1', '#7e0fff', '#233A8F', '#FFFFFF'];

ctx.globalAlpha = 0.2;

const bg_particle_no = 170;

const particles = [];

function init() {
  reset_scene();
  for (let i = 0; i < bg_particle_no; i++) {
    let p = new bg_particle();
    particles.push(p);
  }
}

function reset_scene() {
  ctx.fillStyle = '#1d212b';
  ctx.fillRect(0, 0, w, h);
}

function drawscene() {
  reset_scene();
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.sx;
    if (p.x > w || p.x < 0) {
      p.sx = -p.sx;
    }
    p.y += p.sy;
    if (p.y > h || p.y < 0) {
      p.sy = -p.sy;
    }
    p.draw();
  }
}

function bg_particle() {
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  this.sx = Math.random() * 2;
  this.sy = Math.random() * 2;
  const min = 3;
  const max = 20;
  this.r = Math.random() * (max - min);

  this.draw = function () {
    ctx.fillStyle = fillColour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
  };
}

function animloop() {
  drawscene();
  glitch();
  requestAnimFrame(animloop);
}
init();
animloop();

// glitch
function glitch() {
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'none';
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.01})`;
    ctx.fillRect(
      Math.floor(Math.random() * w),
      Math.floor(Math.random() * h),
      Math.floor(Math.random() * 30) + 1,
      Math.floor(Math.random() * 30) + 1
    );

    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
    ctx.fillRect(
      Math.floor(Math.random() * w),
      Math.floor(Math.random() * h),
      Math.floor(Math.random() * 25) + 1,
      Math.floor(Math.random() * 25) + 1
    );
  }

  ctx.fillStyle = colors[Math.floor(Math.random() * 40)];
  ctx.fillRect(
    Math.random() * w,
    Math.random() * h,
    Math.random() * w,
    Math.random() * h
  );
  ctx.setTransform(1, 0, 0, 0.8, 0.2, 0);
}
