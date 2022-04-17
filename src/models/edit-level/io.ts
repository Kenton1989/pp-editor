import { LevelRoot, RawBlock, RawRef } from "../../game-level-file/v4/types";
import { BlockState, LevelState } from "./state";
import { BoxCell, Grid, SimplePlayerCell } from "./cell";
import { fromRawColor } from "./color";

export function loadLevelState(
  level: LevelRoot,
  title: string = "level"
): LevelState {
  const { children, blockType, ...rawHeader } = level;

  let res: LevelState = {
    header: { title, ...rawHeader },
    blocks: [],
    counter: 0,
  };

  let rawBlks: RawBlock[] = [];
  getBlockDefs(level, rawBlks);

  return res;
}

function getBlockDefs(block: LevelRoot | RawBlock, out: RawBlock[]) {
  for (const blk of block.children) {
    if (blk.blockType === "Block") {
      out.push(blk);
      getBlockDefs(blk, out);
    }
  }
}

function trasformBlock(src: RawBlock): BlockState {
  let newBlk: BlockState = {
    id: src.id,
    name: `Block ${src.id}`,
    width: src.width,
    height: src.height,
    hsl: fromRawColor(src),
    zoomFactor: src.zoomFactor,
    fillWithWalls: src.fillWithWalls,
    floatInSpace: src.floatInSpace,
    grid: makeGrid(src.width, src.height),
  };
  return newBlk;
}

function makeGrid(w: number, h: number): Grid {
  return [...Array(w)].map(() => [...Array(h)]);
}

function makeSimplePlayer(
  block: RawBlock,
  ref?: RawRef
): SimplePlayerCell | undefined {
  if (!isSimpleSolid(block, ref)) return undefined;

  let { x, y, player, possessable, playerOrder } =
    ref === undefined ? block : ref;

  if (!player && !possessable) return undefined;
  let hsl = fromRawColor(block);

  return {
    cellType: "SimplePlayer",
    x,
    y,
    player,
    possessable,
    playerOrder,
    hsl,
  };
}
function makeSimpleBox(block: RawBlock, ref?: RawRef): BoxCell | undefined {
  if (!isSimpleSolid(block, ref)) return undefined;

  let { x, y, player, possessable, playerOrder } =
    ref === undefined ? block : ref;

  if (player || possessable || playerOrder) return undefined;
  let hsl = fromRawColor(block);

  return {
    cellType: "Box",
    x,
    y,
    hsl,
  };
}

function isSimpleSolid(block: RawBlock, ref?: RawRef) {
  if (ref !== undefined && ref.id !== block.id) {
    throw new ReferenceError("param ref is not a reference of the block");
  }
  return (
    block.fillWithWalls === true &&
    block.flipH === false &&
    (ref === undefined ||
      (ref.exitBlock === false &&
        ref.flipH === false &&
        ref.infEnter === false &&
        ref.infExit === false))
  );
}
