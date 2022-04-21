import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LevelState, initialState, BlockState } from "./state";
import {
  AttemptOrder,
  DrawStyle,
  FloorType,
  isAttemptOrder,
  LevelRoot,
} from "../../game-level-file/v4/types";
import { Cell, Grid, RefCell } from "./cell";
import { importLevelState } from "./io";
import { DEFAULT_HEADER } from "../../game-level-file/v4/const";
import { HslColor } from "./color";

function genBlockId(state: LevelState): number {
  return state.counter++;
}

function getBlockIdx(blocks: BlockState[], id: number): number {
  return blocks.findIndex((val) => val.id === id);
}

function getBlock(blocks: BlockState[], id: number): BlockState | undefined {
  return blocks.find((val) => val.id === id);
}

function validPos(blk: BlockState, x: number, y: number) {
  return x < blk.width && y < blk.height && x >= 0 && y >= 0;
}

function getCell(
  state: LevelState,
  blkId: number,
  x: number,
  y: number
): [boolean, BlockState?, Cell?] {
  let blk = getBlock(state.blocks, blkId);
  if (blk === undefined || !validPos(blk, x, y)) {
    return [false, undefined, undefined];
  }
  return [true, blk, blk.grid[x][y]];
}

function makeGrid(width: number, height: number, oldGrid: Grid = []): Cell[][] {
  let res: Cell[][] = [...Array(width)].map((_, i) => {
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

function reset(
  state: LevelState,
  action: PayloadAction<LevelState | undefined>
): LevelState {
  let newState = action.payload;
  return (
    newState ?? {
      header: { title: "level", ...DEFAULT_HEADER },
      blocks: [],
      counter: 0,
    }
  );
}

function importLevel(
  state: LevelState,
  action: PayloadAction<{ raw: LevelRoot; title: string }>
): LevelState {
  let { raw, title } = action.payload;
  return importLevelState(raw, title);
}

function createBlk(state: LevelState) {
  console.log("create new block");
  let id = genBlockId(state);
  let newBlk: BlockState = {
    id: id,
    name: `Block ${id}`,
    width: 7,
    height: 7,
    hsl: "root block",
    zoomFactor: 1,
    fillWithWalls: false,
    floatInSpace: false,
    specialEffect: 0,
    grid: makeGrid(7, 7),
  };

  state.blocks.push(newBlk);
}

function removeBlk(state: LevelState, action: PayloadAction<number>) {
  let deletedBlkId = action.payload;
  state.blocks = state.blocks.filter((val) => val.id !== deletedBlkId);
}

export interface BlockEdit {
  id: number; // used for searching block
  name?: string;
  hsl?: HslColor;
  zoomFactor?: number;
  fillWithWalls?: boolean;
  floatInSpace?: boolean;
  specialEffect?: number;
}

function updateBlk(state: LevelState, action: PayloadAction<BlockEdit>) {
  let updated = action.payload;

  let idx = getBlockIdx(state.blocks, updated.id);
  if (idx < 0) return;

  state.blocks[idx] = { ...state.blocks[idx], ...updated };
}

function resizeBlk(
  state: LevelState,
  action: PayloadAction<{ id: number; w: number; h: number }>
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
  action: PayloadAction<{ cell: Cell; blkId: number }>
) {
  let { blkId, cell } = action.payload;
  setCellImpl(state, blkId, cell);
}

function setCellImpl(state: LevelState, blkId: number, cell: Cell) {
  let { x, y } = cell;
  let [ok, blk] = getCell(state, blkId, x, y);
  if (!ok) return;
  blk!.grid[x][y] = cell;
}

function removeCell(
  state: LevelState,
  action: PayloadAction<{ pos: [number, number]; blkId: number }>
) {
  let { blkId, pos } = action.payload;
  removeCellImpl(state, blkId, pos);
}

function removeCellImpl(
  state: LevelState,
  blkId: number,
  pos: [number, number]
) {
  let [x, y] = pos;

  let [ok, blk] = getCell(state, blkId, x, y);
  if (!ok) return;
  blk!.grid[x][y] = undefined;
}

function moveCell(
  state: LevelState,
  action: PayloadAction<{
    blkId: number;
    from: [number, number];
    to: [number, number];
  }>
) {
  let {
    from: [x1, y1],
    to: [x2, y2],
    blkId,
  } = action.payload;

  if (x1 === x2 && y1 === y2) return;

  let [ok, blk, src] = getCell(state, blkId, x1, y1);
  if (!ok) return;
  if (!validPos(blk!, x2, y2)) return;

  if (src === undefined) {
    blk!.grid[x2][y2] = undefined;
    return;
  }
  let newCell = { ...src, x: x2, y: y2 };
  blk!.grid[x1][y1] = undefined;
  blk!.grid[x2][y2] = newCell;
}

export interface CellEdit {
  blkId: number;
  x: number; // to locate cell
  y: number; // to locate cell
  hsl?: HslColor;
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

function updateCell(state: LevelState, action: PayloadAction<CellEdit>) {
  let update = action.payload;
  let { blkId, x, y, ...newValues } = update;
  let [ok, , tempCell] = getCell(state, blkId, x, y);
  if (!ok) return;
  let cell = tempCell!;

  let turnOnEps = !(cell as RefCell).infEnter && newValues.infEnter;

  for (const key in newValues) {
    if (key in cell) {
      let newVal = (update as any)[key];
      (cell as any)[key] = newVal;
    }
  }

  if (turnOnEps && cell.cellType === "Ref") {
    if (!getBlock(state.blocks, cell.infEnterId) && state.blocks.length > 0) {
      cell.infEnterId = state.blocks[0].id;
    }
  }
}

export interface HeaderEdit {
  title?: string;
  attemptOrder?: AttemptOrder;
  shed?: boolean;
  innerPush?: boolean;
  drawStyle?: DrawStyle;
  customLevelMusic?: number;
  customLevelPalette?: number;
}

function updateHeader(state: LevelState, action: PayloadAction<HeaderEdit>) {
  let newHeader = action.payload;
  if (newHeader.attemptOrder && !isAttemptOrder(newHeader.attemptOrder)) {
    throw new TypeError(`invalid attempt order: ${newHeader.attemptOrder}`);
  }
  for (const s in newHeader) {
    let key = s as keyof HeaderEdit;
    if (newHeader[key] === undefined) {
      delete newHeader[key];
    }
  }
  state.header = { ...state.header, ...newHeader };
}

function setCells(
  state: LevelState,
  action: PayloadAction<{ cells: Cell[]; blkId: number }>
) {
  let { blkId, cells } = action.payload;
  for (const cell of cells) {
    setCellImpl(state, blkId, cell);
  }
}

function removeCells(
  state: LevelState,
  action: PayloadAction<{ posList: [number, number][]; blkId: number }>
) {
  let { blkId, posList } = action.payload;
  for (const pos of posList) {
    removeCellImpl(state, blkId, pos);
  }
}

export const levelSlice = createSlice({
  name: "level",
  initialState,
  reducers: {
    reset,
    importLevel,
    createBlk,
    removeBlk,
    updateBlk,
    resizeBlk,
    setCell,
    removeCell,
    moveCell,
    updateCell,
    setCells,
    removeCells,
    updateHeader,
  },
});

export default levelSlice;
