class Canvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = c.getContext('2d');
    this.stars = genStars(80);
  }

  render() {
    this.ctx.fillStyle = '#1e1e1e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.stars.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, 2*Math.PI);
      this.ctx.fill();
    });
  }

  act() {
    if (!this.star) {
      if (this.count < 50) return this.count++;
      this.star = this.stars[random(0, this.stars.length)];
      this.orig_size = this.star.size;
      this.count = 25;
    }
    this.star.size = this.orig_size * getScale(this.count--);
    if (this.count === 0) {
      this.star.size = this.orig_size;
      this.star = null;
    }
  }
}

var c = document.querySelector('.canvas');
let canvas = new Canvas(c);
canvas.render();

// setInterval(() => {
//   canvas.act();
//   canvas.render();
// }, 16);

function genStars(count) {
  let stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: random(0, 1920),
      y: random(0, 900),
      size: random(5, 15)/20
    });
  }
  return stars;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function smallWeightedRandom(min, max) {
  return Math.floor(Math.abs(Math.random() - Math.random()) * (max - min) + min);
}

function getScale(num) {
  let x = num / 100.0;
  return - 10 * x * x + 10 * x + 1;
}
