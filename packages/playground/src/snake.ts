import p5 from "p5";

export type Direction = "N" | "E" | "S" | "W";

export interface Snake {
  headX: number;
  headY: number;
  direction: Direction;
  body: Array<{ x: number; y: number }>;
  targetLength: number;
  hue: number;
  saturation: number;
  lightness: number;
}

export const GRID = 32;

const DIR_VECTORS: Record<Direction, { dx: number; dy: number }> = {
  N: { dx: 0, dy: -1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  W: { dx: -1, dy: 0 },
};

const TURN_LEFT: Record<Direction, Direction> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};

const TURN_RIGHT: Record<Direction, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

function randomDirection(): Direction {
  const dirs: Direction[] = ["N", "E", "S", "W"];
  return dirs[Math.floor(Math.random() * 4)];
}

function normalRandomLength(min: number, max: number): number {
  const mean = (min + max) / 2;
  const std = (max - min) / 4;
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const val = Math.round(mean + z * std);
  return Math.max(min, Math.min(max, val));
}

export function createSnake(gridCols: number, gridRows: number): Snake {
  const centerX = Math.floor(gridCols / 2);
  const centerY = Math.floor(gridRows / 2);
  return {
    headX: centerX,
    headY: centerY,
    direction: randomDirection(),
    body: [{ x: centerX, y: centerY }],
    targetLength: normalRandomLength(4, 12),
    hue: Math.floor(Math.random() * 360),
    saturation: 75 + Math.floor(Math.random() * 15),
    lightness: 50 + Math.floor(Math.random() * 10),
  };
}

export function tickSnake(
  snake: Snake,
  gridCols: number,
  gridRows: number,
  allOccupied: Set<string>
): void {
  const occupied = new Set(allOccupied);
  occupied.delete(`${snake.headX},${snake.headY}`);

  const tailWillVacate = snake.body.length >= snake.targetLength;
  if (tailWillVacate) {
    const tail = snake.body[0];
    occupied.delete(`${tail.x},${tail.y}`);
  }

  const candidates: { dir: Direction; weight: number }[] = [
    { dir: snake.direction, weight: 0.6 },
    { dir: TURN_LEFT[snake.direction], weight: 0.2 },
    { dir: TURN_RIGHT[snake.direction], weight: 0.2 },
  ];

  const safeCandidates = candidates.filter(({ dir }) => {
    const vec = DIR_VECTORS[dir];
    const nx = (snake.headX + vec.dx + gridCols) % gridCols;
    const ny = (snake.headY + vec.dy + gridRows) % gridRows;
    return !occupied.has(`${nx},${ny}`);
  });

  let chosenDir: Direction;

  if (safeCandidates.length > 0) {
    const totalWeight = safeCandidates.reduce((sum, c) => sum + c.weight, 0);
    let r = Math.random() * totalWeight;
    chosenDir = safeCandidates[0].dir;
    for (const c of safeCandidates) {
      r -= c.weight;
      if (r <= 0) {
        chosenDir = c.dir;
        break;
      }
    }
  } else {
    let r = Math.random();
    if (r < 0.6) {
      chosenDir = snake.direction;
    } else if (r < 0.8) {
      chosenDir = TURN_LEFT[snake.direction];
    } else {
      chosenDir = TURN_RIGHT[snake.direction];
    }
  }

  snake.direction = chosenDir;

  const vec = DIR_VECTORS[chosenDir];
  snake.headX = (snake.headX + vec.dx + gridCols) % gridCols;
  snake.headY = (snake.headY + vec.dy + gridRows) % gridRows;

  snake.body.push({ x: snake.headX, y: snake.headY });

  while (snake.body.length > snake.targetLength) {
    snake.body.shift();
  }
}

export function drawSnake(p: p5, snake: Snake): void {
  const halfCell = GRID / 2;
  p.noStroke();

  for (let i = 0; i < snake.body.length; i++) {
    const seg = snake.body[i];
    const px = seg.x * GRID + halfCell;
    const py = seg.y * GRID + halfCell;
    const isHead = i === snake.body.length - 1;
    const radius = isHead ? halfCell * 0.8 : halfCell * 0.55;

    const t = snake.body.length > 1 ? i / (snake.body.length - 1) : 1;
    const bodyAlpha = 0.4 + t * 0.5;

    p.fill(
      `hsla(${snake.hue}, ${snake.saturation}%, ${snake.lightness}%, ${bodyAlpha})`
    );
    p.circle(px, py, radius * 2);
  }
}
