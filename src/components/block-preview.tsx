import { PropsWithoutRef, useEffect, useRef } from "react";
import { useBlockMap } from "../app/selector";
import { BlockState } from "../models/edit-level/state";
import { toHslArr } from "../models/edit-level/color";
import { Cell, RefCell } from "../models/edit-level/cell";
import Color from "color";

const MAX_RECURSIVE_RENDER_LEVEL = 5;
const [CANVAS_WIDTH, CANVAS_HEIGHT] = [300, 300];

const [L_EYE_X_OFFEST, R_EYE_X_OFFSET, EYE_Y_OFFSET] = [0.3, 0.7, 0.45];
const [EYE_RADIUS, PUPIL_RADIUS] = [0.08, 0.05];
const eyeColor = (color: Color) => color.darken(0.7).string();

const wallColor = (color: Color) => color.string();
const WALL_LIGHT_OVERLAY = "rgba(255,255,255,0.6)";
const WALL_SHADE_OVERLAY = "rgba(0,0,0,0.6)";
const WALL_CENTER_WIDTH = 0.5;

const borderColor = (color: Color) => color.darken(0.7).string();
const BORDER_WIDTH = 0.03;

const INF_OVERLAY_COLOR = "rgba(0,0,0,0.4)";
const CLONE_OVERLAY_COLOR = "rgba(255,255,255,0.4)";

const floorColor = (color: Color) => color.darken(0.5).string();
const FLOOR_OVERLAY_COLOR = "rgba(255,255,255,0.5)";
const FLOOR_BORDER_PADDING = 0.06;
const FLOOR_BORDER_WIDTH = 0.07;

export function BlockPreview(
  props: PropsWithoutRef<{
    block: BlockState;
    className?: string;
    style?: React.CSSProperties;
    width?: number;
    height?: number;
  }>
): JSX.Element {
  let { block, width = CANVAS_WIDTH, height = CANVAS_HEIGHT, ...other } = props;
  let map = useBlockMap();
  let ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let canvas = ref.current;
    if (canvas === null) return;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    renderBlock(ctx, block, map, 0, 0, width, height);
  }, [block, map, width, height]);

  return <canvas ref={ref} width={width} height={height} {...other} />;
}

// simple cell = any cell except RefCell
export function BlockCellPreview(
  props: PropsWithoutRef<{
    cell: Cell;
    parentColor: Color;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
  }>
): JSX.Element {
  let map = useBlockMap();
  let {
    cell,
    parentColor: colorBase,
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT,
    ...other
  } = props;
  let ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let canvas = ref.current;
    if (canvas === null) return;
    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    renderCell(ctx, colorBase, cell, map, 0, 0, width, height);
  }, [map, cell, colorBase, width, height]);

  return <canvas ref={ref} width={width} height={height} {...other} />;
}

function renderBlock(
  ctx: CanvasRenderingContext2D,
  block: BlockState,
  map: Map<BlockState["id"], BlockState>,
  x0 = 0,
  y0 = 0,
  w0 = CANVAS_WIDTH,
  h0 = CANVAS_HEIGHT,
  level = 0,
  flipH = false
) {
  let colorBase = Color.hsl(toHslArr(block.hsl));

  if (level >= MAX_RECURSIVE_RENDER_LEVEL) {
    ctx.fillStyle = colorBase.string();
    ctx.fillRect(x0, y0, w0, h0);
    return;
  }

  if (block.fillWithWalls) {
    ctx.fillStyle = wallColor(colorBase);
    ctx.fillRect(x0, y0, w0, h0);
    return;
  }

  let floorClr = floorColor(colorBase);

  let cellW = w0 / block.width;
  let cellH = h0 / block.height;

  // draw floor
  ctx.fillStyle = floorClr;
  ctx.fillRect(x0, y0, w0, h0);

  // draw cells
  block.grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === undefined) return;

      let [x, y] = [
        x0 + (flipH ? block.width - 1 - r : r) * cellW,
        y0 + (block.height - 1 - c) * cellH,
      ];

      renderCell(ctx, colorBase, cell, map, x, y, cellW, cellH, level, flipH);
    });
  });
}

function renderCell(
  ctx: CanvasRenderingContext2D,
  colorBase: Color,
  cell: Cell,
  map: Map<BlockState["id"], BlockState>,
  x0: number,
  y0: number,
  w0: number,
  h0: number,
  parentLevel = 0,
  parentFlipH = false
) {
  if (cell.cellType === "Ref") {
    let refSrc = map.get(cell.id);
    if (refSrc === undefined) return;
    let flipRef = parentFlipH !== cell.flipH;
    renderBlock(ctx, refSrc, map, x0, y0, w0, h0, parentLevel + 1, flipRef);
    let borderClr = borderColor(Color.hsl(toHslArr(refSrc.hsl)));
    drawBorder(ctx, borderClr, x0, y0, w0, h0);
    renderRefDetails(ctx, cell, refSrc, x0, y0, w0, h0, parentLevel + 1);
    return;
  }

  if (cell.cellType === "Floor") {
    let [dx, dy] = [w0 * FLOOR_BORDER_PADDING, h0 * FLOOR_BORDER_PADDING];
    ctx.fillStyle = FLOOR_OVERLAY_COLOR;
    ctx.fillRect(x0 + dx, y0 + dy, w0 - 2 * dx, h0 - 2 * dy);

    [dx, dy] = [dx + w0 * FLOOR_BORDER_WIDTH, dy + h0 * FLOOR_BORDER_WIDTH];
    ctx.fillStyle = floorColor(colorBase);
    ctx.fillRect(x0 + dx, y0 + dy, w0 - 2 * dx, h0 - 2 * dy);

    if (cell.floorType === "PlayerButton") {
      drawEyes(ctx, FLOOR_OVERLAY_COLOR, x0, y0, w0, h0);
    }
    return;
  }

  if (cell.cellType === "Wall") {
    let color = wallColor(colorBase);
    renderWall(ctx, color, x0, y0, w0, h0);
    return;
  }

  if (cell.cellType === "SimplePlayer" || cell.cellType === "Box") {
    let color = Color.hsl(toHslArr(cell.hsl));
    ctx.fillStyle = color.string();
    ctx.fillRect(x0, y0, w0, h0);
    let borderClr = borderColor(color);
    drawBorder(ctx, borderClr, x0, y0, w0, h0);
    if (cell.cellType === "SimplePlayer") {
      if (cell.player) {
        drawEyes(ctx, eyeColor(color), x0, y0, w0, h0, true);
      } else if (cell.possessable) {
        drawEyes(ctx, eyeColor(color), x0, y0, w0, h0, false);
      }
    }
    return;
  }
}

function renderRefDetails(
  ctx: CanvasRenderingContext2D,
  ref: RefCell,
  refSrc: BlockState,
  x0: number,
  y0: number,
  w0: number,
  h0: number,
  level = 0
) {
  let colorBase = Color.hsl(toHslArr(refSrc.hsl));

  if (!ref.exitBlock) {
    ctx.fillStyle = CLONE_OVERLAY_COLOR;
    ctx.fillRect(x0, y0, w0, h0);
  }

  if (ref.infEnter || ref.infExit) {
    ctx.fillStyle = INF_OVERLAY_COLOR;
    ctx.fillRect(x0, y0, w0, h0);
  }

  if (level >= MAX_RECURSIVE_RENDER_LEVEL) {
    return;
  }

  if (ref.possessable || ref.player) {
    let eyeClr = eyeColor(colorBase);
    drawEyes(ctx, eyeClr, x0, y0, w0, h0, ref.player);
  }
}

function renderWall(
  ctx: CanvasRenderingContext2D,
  color: string,
  x0: number,
  y0: number,
  w0: number,
  h0: number
) {
  let [x1, y1] = [x0 + w0, y0 + h0];
  let [cw, ch] = [w0 * WALL_CENTER_WIDTH, h0 * WALL_CENTER_WIDTH];
  let [cx, cy] = [x0 + (w0 - cw) / 2, y0 + (h0 - ch) / 2];

  ctx.fillStyle = color;
  ctx.fillRect(x0, y0, w0, h0);

  ctx.fillStyle = WALL_LIGHT_OVERLAY;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y0);
  ctx.lineTo(x0, y1);
  ctx.lineTo(x0, y0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = WALL_SHADE_OVERLAY;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, y0);
  ctx.lineTo(x0, y1);
  ctx.lineTo(x1, y1);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = color;
  ctx.fillRect(cx, cy, cw, ch);
}

function drawBorder(
  ctx: CanvasRenderingContext2D,
  color: string,
  x0: number,
  y0: number,
  w0: number,
  h0: number
) {
  let [x1, y1] = [x0 + 0.5 * BORDER_WIDTH * w0, y0 + 0.5 * BORDER_WIDTH * h0];
  let [x2, y2] = [
    x0 + (1 - 0.5 * BORDER_WIDTH) * w0,
    y0 + (1 - 0.5 * BORDER_WIDTH) * h0,
  ];
  let [vLineWidth, hLineWidth] = [BORDER_WIDTH * w0, BORDER_WIDTH * h0];

  ctx.strokeStyle = color;
  ctx.lineCap = "square";

  ctx.lineWidth = hLineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y1);
  ctx.moveTo(x1, y2);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.lineWidth = vLineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1, y2);
  ctx.moveTo(x2, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  color: string,
  x0: number,
  y0: number,
  w0: number,
  h0: number,
  solid = true
) {
  let lEyeX = x0 + L_EYE_X_OFFEST * w0;
  let rEyeX = x0 + R_EYE_X_OFFSET * w0;
  let eyeY = y0 + EYE_Y_OFFSET * h0;
  let len = w0;
  let outerR = EYE_RADIUS * len;
  let innerR = PUPIL_RADIUS * len;
  if (solid) {
    innerR = 0;
  }
  fillRing(ctx, color, lEyeX, eyeY, innerR, outerR);
  fillRing(ctx, color, rEyeX, eyeY, innerR, outerR);
}

function fillRing(
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  innerR: number,
  outerR: number
) {
  let gradient = ctx.createRadialGradient(x, y, innerR, x, y, outerR);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.001, color);
  gradient.addColorStop(1, color);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, outerR, 0, Math.PI * 2);
  ctx.fill();
}
