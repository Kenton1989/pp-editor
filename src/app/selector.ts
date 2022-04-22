import Color from "color";
import { useMemo } from "react";
import { Cell } from "../models/edit-level/cell";
import { HslColor, toHslArr } from "../models/edit-level/color";
import { BlockState, LevelState } from "../models/edit-level/state";
import { Brush } from "../models/edit-ui/brush";
import { useAppSelector } from "./hook";
import { RootState } from "./store";

export function currentBlock(state: RootState): BlockState | undefined {
  return state.level.present.blocks.find(
    (val) => val.id === state.ui.editingBlk
  );
}

export function useLevel(): LevelState {
  return useAppSelector((state) => state.level.present);
}

export function useBrush(): Brush {
  return useAppSelector((state) => state.ui.brush);
}

export function useBlockList(): BlockState[] {
  return useAppSelector((state) => state.level.present.blocks);
}

export function useBlockMap(): Map<BlockState["id"], BlockState> {
  let blkList = useBlockList();
  return useMemo(() => new Map(blkList.map((blk) => [blk.id, blk])), [blkList]);
}

export function useCurrentBlk(): BlockState | undefined {
  let blkMap = useBlockMap();
  let id = useAppSelector((state) => state.ui.editingBlk);
  if (id === undefined) return undefined;
  return blkMap.get(id);
}

export function useBlock(id: number): BlockState | undefined {
  let blkMap = useBlockMap();
  return blkMap.get(id);
}

export function useBlockColor(blk: BlockState | undefined): Color {
  let val: HslColor = blk ? blk.hsl : "root block";
  return useMemo(() => Color.hsl(toHslArr(val)), [val]);
}

export function useCurrentCell(): [BlockState?, Cell?] {
  let blkMap = useBlockMap();

  let [id, pos] = useAppSelector((state) => [
    state.ui.editingBlk,
    state.ui.editingCell,
  ]);

  return useMemo((): [BlockState?, Cell?] => {
    if (id === undefined) return [undefined, undefined];

    let blk = blkMap.get(id);
    if (blk === undefined) return [undefined, undefined];

    if (pos === undefined) return [blk, undefined];

    let [x, y] = pos;
    if (x >= blk.width || y >= blk.height || x < 0 || y < 0) {
      return [blk, undefined];
    }
    return [blk, blk.grid[x][y]];
  }, [blkMap, id, pos]);
}
