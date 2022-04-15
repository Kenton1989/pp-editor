import { createSlice } from "@reduxjs/toolkit";
import Block from "./block";
import Cell from "./cell";
import { LevelState, initialState } from "./state";
import { FloorType } from "../../game-level-file/v4/types";

function genBlockId(): number {
  return Date.now();
}

function getBlockIdx(blocks: Block[], id: number): number {
  return blocks.findIndex((val) => val.id === id);
}

function getBlock(blocks: Block[], id: number): Block {
  return blocks.find((val) => val.id === id);
}

function validPos(blk: Block, x: number, y: number) {
  return x < blk.width && y < blk.height && x >= 0 && y >= 0;
}

function getCell(
  state: LevelState,
  blkId: number,
  x: number,
  y: number
): [Block, Cell, boolean] {
  let blk = getBlock(state.blocks, blkId);
  if (blk === undefined || !validPos(blk, x, y)) {
    return [undefined, undefined, false];
  }
  return [blk, blk.grid[x][y], true];
}

function makeGrid(
  width: number,
  height: number,
  oldGrid: Cell[][] = []
): Cell[][] {
  let res: Cell[][] = Array(width).map((_, i) => {
    if (i < oldGrid.length) {
      let oldHeight = oldGrid[i].length;
      if (oldHeight > height) {
        return oldGrid[i].slice(0, height);
      } else {
        return [...oldGrid[i], ...Array(height - oldHeight)];
      }
    } else {
      return [...Array(height)];
    }
  });

  return res;
}

function createBlk(state: LevelState) {
  let newBlk: Block = {
    id: genBlockId(),
    name: `Block ${state.counter}`,
    width: 7,
    height: 7,
    rgb: [0, 0, 0],
    zoomFactor: 1,
    fillWithWalls: false,
    floatInSpace: false,
    grid: makeGrid(7, 7),
  };

  state.blocks.push(newBlk);
}

function removeBlk(state: LevelState, action: { payload: number }) {
  let deletedBlkId = action.payload;
  state.blocks = state.blocks.filter((val) => val.id !== deletedBlkId);
}

interface BlockEdit {
  id: number; // used for searching block
  name?: string;
  rgb?: [number, number, number];
  zoomFactor?: number;
  fillWithWalls?: boolean;
  floatInSpace?: boolean;
}

function updateBlk(state: LevelState, action: { payload: BlockEdit }) {
  let updated = action.payload;

  let idx = getBlockIdx(state.blocks, updated.id);
  if (idx < 0) return;

  state.blocks[idx] = { ...state.blocks[idx], ...updated };
}

function resizeBlk(
  state: LevelState,
  action: { payload: { id: number; w: number; h: number } }
) {
  let updatedId = action.payload.id;
  let blk = getBlock(state.blocks, updatedId);
  if (blk === undefined) return;

  let { w, h } = action.payload;
  let newGrid = makeGrid(w, h, blk.grid);
  blk.width = w;
  blk.height = h;
  blk.grid = newGrid;
}

function setCell(
  state: LevelState,
  action: { payload: { cell: Cell; blkId: number } }
) {
  let { blkId, cell } = action.payload;
  let { x, y } = cell;

  let [blk, , ok] = getCell(state, blkId, x, y);
  if (!ok) return;

  blk.grid[x][y] = cell;
}

function moveCell(
  state: LevelState,
  action: {
    payload: { blkId: number; from: [number, number]; to: [number, number] };
  }
) {
  let {
    from: [x1, y1],
    to: [x2, y2],
    blkId,
  } = action.payload;

  if (x1 === x2 && y1 === y2) return;

  let [blk, src, ok] = getCell(state, blkId, x1, y1);
  if (!ok) return;
  if (!validPos(blk, x2, y2)) return;

  let newCell = { ...src, x: x2, y: y2 };
  blk.grid[x1][y1] = undefined;
  blk.grid[x2][y2] = newCell;
}

interface CellEdit {
  blkId: number;
  x: number; // to locate cell
  y: number; // to locate cell
  rgb?: [number, number, number];
  id?: number;
  exitBlock?: boolean;
  infExit?: boolean;
  infExitNum?: number;
  infEnter?: boolean;
  infEnterNum?: number;
  infEnterId?: number;
  player?: boolean;
  possessable?: boolean;
  playerOrder?: number;
  flipH?: boolean;
  floatInSpace?: boolean;
  specialEffect?: number;
  floorType?: FloorType;
}

function updateCell(state: LevelState, action: { payload: CellEdit }) {
  let update = action.payload;
  let { blkId, x, y } = update;
  let [, cell, ok] = getCell(state, blkId, x, y);
  if (!ok) return;

  for (const key in Object.keys(update)) {
    if (key in cell) {
      (cell as any)[key] = (update as any)[key];
    }
  }
}

export const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    createBlk,
    removeBlk,
    updateBlk,
    resizeBlk,
    setCell,
    moveCell,
    updateCell,
  },
});

export default blocksSlice;