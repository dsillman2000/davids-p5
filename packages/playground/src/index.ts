import p5 from "p5";
import { type Snake, createSnake, tickSnake, drawSnake, GRID } from "./snake";

const TICK_INTERVAL = 5;

const sketch = (p: p5) => {
  let snakes: Snake[] = [];
  let gridCols = 0;
  let gridRows = 0;

  const updateGrid = () => {
    gridCols = Math.floor(p.width / GRID);
    gridRows = Math.floor(p.height / GRID);
  };

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("canvas-container");
    updateGrid();
  };

  p.draw = () => {
    p.background(0);

    if (gridCols > 0 && gridRows > 0 && p.frameCount % TICK_INTERVAL === 0) {
      const occupied = new Set<string>();
      for (const snake of snakes) {
        for (const seg of snake.body) {
          occupied.add(`${seg.x},${seg.y}`);
        }
      }

      for (const snake of snakes) {
        tickSnake(snake, gridCols, gridRows, occupied);
      }
    }

    for (const snake of snakes) {
      drawSnake(p, snake);
    }
  };

  p.mousePressed = () => {
    if (gridCols > 0 && gridRows > 0) {
      snakes.push(createSnake(gridCols, gridRows));
    }
  };

  p.keyPressed = () => {
    if (p.key === "r" || p.key === "R") {
      snakes = [];
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    updateGrid();
  };
};

new p5(sketch);
