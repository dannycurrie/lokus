import glitch from './glitch.js';
import particles from './particles.js';

const fillColour = '#0fffc1';

export default () => {
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
  let w = window.innerWidth;
  let h = window.outerHeight * 2;
  canvas.width = w;
  canvas.height = h;
  ctx.globalAlpha = 0.2;

  const drawParticles = particles(ctx, w, h, fillColour);
  const drawGlitch = glitch(ctx, w, h);

  function animloop() {
    drawParticles();
    drawGlitch();
    requestAnimFrame(animloop);
  }

  return animloop();
};
