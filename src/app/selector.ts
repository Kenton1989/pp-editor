import { Block, Cell } from "../models/edit-level/types";
import { RootState } from "./store";

export function currentBlock(state: RootState): Block | undefined {
  return state.level.present.blocks.find(
    (val) => val.id === state.ui.editingBlk
  );
}

export function currentCell(state: RootState): [Block?, Cell?] {
  let blk = currentBlock(state);
  if (blk === undefined) return [undefined, undefined];

  let pos = state.ui.editingCell;
  let cell: Cell | undefined = undefined;
  if (pos !== undefined) {
    cell = blk.grid[pos[0]][pos[1]];
  }

  return [blk, cell];
}
