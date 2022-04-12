import Block from "./block";

export interface BlocksState {
  list: Block[];
  editingBlock: number;
  selectedCell: [number, number];
  counter: number;
}

export const initialState: BlocksState = {
  list: [],
  editingBlock: -1,
  selectedCell: [-1, -1],
  counter: 1,
};
