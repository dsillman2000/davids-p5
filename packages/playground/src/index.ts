import p5 from "p5";

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(800, 600);
  };

  p.draw = () => {
    p.background(220);
  };
};

new p5(sketch);
