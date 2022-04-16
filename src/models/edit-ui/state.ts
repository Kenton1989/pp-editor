import { Brush } from "./brush";

export interface UiState {
  editingBlk?: number;
  editingCell?: [number, number];
  brush: Brush;
}

export const initialState: UiState = {
  editingBlk: undefined,
  editingCell: undefined,
  brush: {
    brushType: "Select",
  },
};
