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
  return buildPoint({}, s.key);
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

// particles

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");

var w = window.innerWidth, h = window.outerHeight;
canvas.width = w;
canvas.height = h;

var bg_particle_no = 180;

var particles = [];

function init() {
  reset_scene();
  for (var i = 0; i < bg_particle_no; i++) {
    var p = new bg_particle();
    particles.push(p);
  }
}

function reset_scene() {
  ctx.fillStyle = "#03244B";
  ctx.fillRect(0, 0, w, h);
}

function drawscene() {
  reset_scene();
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
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
  var min = 3;
  var max = 20;
  this.r = Math.random() * (max - min);


  this.draw = function () {
    ctx.fillStyle = "#0fffc1";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
  }
}

function animloop() {
  drawscene();
  requestAnimFrame(animloop);
}
init();
animloop();
