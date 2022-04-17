import { LevelRoot, RawBlock, RawRef } from "../../game-level-file/v4/types";
import { BlockState, LevelState } from "./state";
import { BoxCell, FloorCell, Grid, SimplePlayerCell, WallCell } from "./cell";
import { fromRawColor, toRawLevelColor } from "./color";

export function importLevelState(
  level: LevelRoot,
  title: string = "level"
): LevelState {
  const { children, blockType, ...rawHeader } = level;

  let res: LevelState = {
    header: { title, ...rawHeader },
    blocks: [],
    counter: 0,
  };

  let blkMap: Map<RawBlock["id"], RawBlock> = new Map();
  getBlockDefs(level, blkMap);

  let blkList = [...blkMap.values()];
  blkList.sort((a, b) => a.id - b.id);

  if (blkList.length > 0) {
    res.counter = blkList[blkList.length - 1].id;
  }

  for (const blk of blkList) {
    res.blocks.push(importBlock(blk, blkMap));
  }

  return res;
}

export function exportLevelState(level: LevelState): LevelRoot {
  let { title, ...rawHeader } = level.header;
  let res: LevelRoot = {
    blockType: "Root",
    ...rawHeader,
    children: [],
  };
  let cnt = level.counter;
  let genId = () => ++cnt;

  for (const blk of level.blocks) {
    res.children.push(exportBlock(blk, genId));
  }

  return res;
}

function getBlockDefs(
  block: LevelRoot | RawBlock,
  out: Map<RawBlock["id"], RawBlock>
) {
  for (const blk of block.children) {
    if (blk.blockType === "Block") {
      out.set(blk.id, blk);
      getBlockDefs(blk, out);
    }
  }
}

function importBlock(
  src: RawBlock,
  all: Map<RawBlock["id"], RawBlock>
): BlockState {
  let newBlk: BlockState = {
    id: src.id,
    name: `Block ${src.id}`,
    width: src.width,
    height: src.height,
    hsl: fromRawColor(src),
    zoomFactor: src.zoomFactor,
    fillWithWalls: src.fillWithWalls,
    floatInSpace: src.floatInSpace,
    specialEffect: src.specialEffect,
    grid: makeGrid(src.width, src.height),
  };

  for (const blk of src.children) {
    if (blk.blockType === "Wall") {
      let { blockType, ...data } = blk;
      let c: WallCell = {
        cellType: "Wall",
        ...data,
      };
      newBlk.grid[c.x][c.y] = c;
      continue;
    }

    if (blk.blockType === "Floor") {
      let { blockType, ...data } = blk;
      let c: FloorCell = {
        cellType: "Floor",
        ...data,
      };
      newBlk.grid[c.x][c.y] = c;
      continue;
    }

    let ref: RawRef | undefined, refSrc: RawBlock;
    if (blk.blockType === "Block") {
      ref = undefined;
      refSrc = blk;
    } else {
      ref = blk;
      let val = all.get(ref.id);
      if (val === undefined) continue;
      refSrc = val;
    }

    let p = makeSimplePlayer(refSrc, ref);
    if (p !== undefined) {
      newBlk.grid[p.x][p.y] = p;
      continue;
    }

    let b = makeSimpleBox(refSrc, ref);
    if (b !== undefined) {
      newBlk.grid[b.x][b.y] = b;
      continue;
    }
  }
  return newBlk;
}

function exportBlock(blk: BlockState, genId: () => number): RawBlock {
  let { name, grid, hsl, ...rawData } = blk;
  let res: RawBlock = {
    blockType: "Block",
    x: -1,
    y: -1,
    ...toRawLevelColor(hsl),
    ...rawData,
    player: false,
    playerOrder: 0,
    possessable: false,
    flipH: false,
    children: [],
  };

  blk.grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === undefined) return;
      switch (cell.cellType) {
        case "Box":
          return res.children.push(
            exportSimpleBox(cell, { x: r, y: c, id: genId() })
          );
        case "SimplePlayer":
          return res.children.push(
            exportSimplePlayer(cell, { x: r, y: c, id: genId() })
          );
        case "Floor":
          let { cellType: f, ...fData } = cell;
          return res.children.push({ blockType: f, ...fData });
        case "Wall":
          let { cellType: w, ...wData } = cell;
          return res.children.push({ blockType: w, ...wData });
        case "Ref":
          let { cellType: rType, ...rData } = cell;
          return res.children.push({ blockType: rType, ...rData });
      }
    });
  });

  return res;
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

function exportSimplePlayer(
  p: SimplePlayerCell,
  data: {
    id: number;
    x: number;
    y: number;
  }
): RawBlock {
  return {
    blockType: "Block",
    ...data,
    width: 1,
    height: 1,
    ...toRawLevelColor(p.hsl),
    zoomFactor: 1,
    fillWithWalls: true,
    player: p.player,
    playerOrder: p.playerOrder,
    possessable: p.possessable,
    flipH: false,
    floatInSpace: false,
    specialEffect: 0,
    children: [],
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

function exportSimpleBox(
  b: BoxCell,
  data: {
    id: number;
    x: number;
    y: number;
  }
): RawBlock {
  return {
    blockType: "Block",
    ...data,
    width: 1,
    height: 1,
    ...toRawLevelColor(b.hsl),
    zoomFactor: 1,
    fillWithWalls: true,
    player: false,
    playerOrder: 0,
    possessable: false,
    flipH: false,
    floatInSpace: false,
    specialEffect: 0,
    children: [],
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
