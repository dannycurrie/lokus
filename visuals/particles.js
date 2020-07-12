export default (ctx, w, h, fillColour) => {
  const bg_particle_no = 100;

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

  init();
  return drawscene;
};
