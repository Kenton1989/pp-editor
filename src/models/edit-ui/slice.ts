import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FloorType } from "../../game-level-file/v4/types";
import { HslColor } from "../edit-level/color";
import { Brush } from "./brush";
import { initialState, UiState } from "./state";

function selectBlk(state: UiState, action: PayloadAction<number | undefined>) {
  let blkId = action.payload;
  state.editingBlk = blkId;
  state.editingCell = undefined;
}

function selectCell(
  state: UiState,
  action: PayloadAction<[number, number] | undefined>
) {
  let pos = action.payload;
  let old = state.editingCell;
  if (
    pos === undefined ||
    old === undefined ||
    pos[0] !== old[0] ||
    pos[1] !== old[1]
  ) {
    state.editingCell = pos;
  } else {
    // unselect editing cell if pos is the same to old
    state.editingCell = undefined;
  }
}

function setBrush(state: UiState, action: PayloadAction<Brush>) {
  let brush = action.payload;
  state.brush = { ...brush };
  if (brush.brushType !== "Select") {
    state.editingCell = undefined;
  }
}

interface BrushEdit {
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
  hsl?: HslColor;
  floorType?: FloorType;
}

function updateBrush(state: UiState, action: PayloadAction<BrushEdit>) {
  let newValues = action.payload;
  for (const key in newValues) {
    if (key in state.brush) {
      (state.brush as any)[key] = (newValues as any)[key];
    }
  }
}

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialState,
  reducers: {
    selectBlk,
    selectCell,
    setBrush,
    updateBrush,
  },
});

export default uiSlice;
