import { createSlice } from "@reduxjs/toolkit";
import Block from "./block";
import Cell, { FloorType } from "./cell";
import { BlocksState, initialState } from "./state";

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
  state: BlocksState,
  x: number,
  y: number
): [Block, Cell, boolean] {
  let blk = getBlock(state.list, state.editingBlock);
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

function create(state: BlocksState) {
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

  state.list.push(newBlk);
}

function remove(state: BlocksState, action: { payload: number }) {
  let deletedBlkId = action.payload;
  state.list = state.list.filter((val) => val.id !== deletedBlkId);
}

interface BlockEdit {
  id?: number; // used for searching block
  name?: string;
  rgb?: [number, number, number];
  zoomFactor?: number;
  fillWithWalls?: boolean;
  floatInSpace?: boolean;
}

function update(state: BlocksState, action: { payload: BlockEdit }) {
  let updated = action.payload;
  updated.id = updated.id | state.editingBlock;

  let idx = getBlockIdx(state.list, updated.id);
  if (idx < 0) return state;

  state.list[idx] = { ...state.list[idx], ...updated };
}

function resize(
  state: BlocksState,
  action: { payload: { id?: number; w: number; h: number } }
) {
  let updatedId = action.payload.id | state.editingBlock;
  let blk = getBlock(state.list, updatedId);
  if (blk === undefined) return;

  let { w, h } = action.payload;
  let newGrid = makeGrid(w, h, blk.grid);
  blk.width = w;
  blk.height = h;
  blk.grid = newGrid;
}

function selectBlk(state: BlocksState, action: { payload: number }) {
  let newId = action.payload;
  if (state.editingBlock === newId) return;

  if (getBlock(state.list, newId) === undefined) {
    return;
  }

  state.editingBlock = newId;
  state.selectedCell = undefined;
}

function selectCell(state: BlocksState, action: { payload: [number, number] }) {
  let pos = action.payload;
  let [, , ok] = getCell(state, ...pos);
  if (!ok) return;
  state.selectedCell = pos;
}

function setCell(state: BlocksState, action: { payload: Cell }) {
  let cell = action.payload;
  let { x, y } = cell;

  let [blk, , ok] = getCell(state, x, y);
  if (!ok) return;

  blk.grid[x][y] = cell;
  state.selectedCell = [x, y];
}

function moveCell(
  state: BlocksState,
  action: { payload: { from: [number, number]; to: [number, number] } }
) {
  let {
    from: [x1, y1],
    to: [x2, y2],
  } = action.payload;

  if (x1 === x2 && y1 === y2) return;

  let [blk, src, ok] = getCell(state, x1, y1);
  if (!ok) return;
  if (!validPos(blk, x2, y2)) return;

  let newCell = { ...src, x: x2, y: y2 };
  blk.grid[x1][y1] = undefined;
  blk.grid[x2][y2] = newCell;
  state.selectedCell = [x2, y2];
}

interface CellEdit {
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

function updateCell(state: BlocksState, action: { payload: CellEdit }) {
  let updated = action.payload;
  let { x, y } = updated;
  let [, cell, ok] = getCell(state, x, y);
  if (!ok) return;

  for (const key in updated) {
    if (key in cell) {
      cell[key] = updated[key];
    }
  }
}

export const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    create,
    remove,
    update,
    resize,
    selectBlk,
    selectCell,
    setCell,
    moveCell,
    updateCell,
  },
});

export default blocksSlice;
