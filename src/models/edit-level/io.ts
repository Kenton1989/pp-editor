import { LevelRoot, RawBlock, RawRef } from "../../game-level-file/v4/types";
import { LevelState } from "./state";
import convert from "color-convert";
import { SimplePlayerCell } from "./cell";

export function loadLevelState(level: LevelRoot): LevelState {
  const { children, blockType, ...rawHeader } = level;

  let res: LevelState = {
    header: { title: "", ...rawHeader },
    blocks: [],
    counter: 0,
  };

  let rawBlks = getBlockDefs(level);

  return res;
}

function getBlockDefs(block: LevelRoot | RawBlock): RawBlock[] {
  let res: RawBlock[] = [];
  for (const blk of block.children) {
    if (blk.blockType === "Block") {
      res.push(blk);
    }
  }
  for (const blk of res) {
    res.push(...getBlockDefs(blk));
  }
  return res;
}

function makeSimplePlayer(
  block: RawBlock,
  ref?: RawRef
): SimplePlayerCell | undefined {
  if (!isSimpleSolid(block, ref)) return undefined;

  let isPlayer = ref === undefined ? block.player : ref.player;
  if (!isPlayer) return undefined;
  let { x, y, possessable, playerOrder } = ref === undefined ? block : ref;
  let { hue, sat, val } = block;
  let hsl = convert.hsv.hsl([hue * 360, sat * 100, val * 100]);

  return {
    cellType: "SimplePlayer",
    x,
    y,
    possessable,
    playerOrder,
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
