import { DEFAULT_ATTEMPT_ORDER } from "./const";
import { RawBlock, RawLevelHeader, LevelRoot, AnyBlock } from "./types";

export default function encodeLevel(levelObj: LevelRoot): string {
  let header = encodeHeader(levelObj);
  let body = encodeBody(levelObj);
  return header + body;
}

const ENCODE_HEADER_LINES: [keyof RawLevelHeader, (arg: any) => string][] = [
  ["version", (version) => `version ${version}\n`],
  [
    "attemptOrder",
    (attemptOrder) =>
      arrEq(attemptOrder, DEFAULT_ATTEMPT_ORDER)
        ? ""
        : `attempt_order ${attemptOrder.join(",")}\n`,
  ],
  ["shed", (shed) => (shed ? "shed 1\n" : "")],
  ["innerPush", (innerPush) => (innerPush ? "inner_push 1\n" : "")],
  [
    "drawStyle",
    (drawStyle) => (drawStyle === "" ? "" : `draw_style ${drawStyle}\n`),
  ],
  [
    "customLevelMusic",
    (music) => (music < 0 ? "" : `custom_level_music ${music}\n`),
  ],
  [
    "customLevelPalette",
    (palette) => (palette < 0 ? "" : `custom_level_palette ${palette}\n`),
  ],
];

function encodeHeader(headers: RawLevelHeader): string {
  let res = "";
  for (const [propKey, encodeLine] of ENCODE_HEADER_LINES) {
    res += encodeLine(headers[propKey]);
  }
  res += "#\n";
  return res;
}

const ENCODE_BODY_LINE: { [k: string]: (arg: any) => string } = {
  Block: (blk) =>
    `Block ${blk.x} ${blk.y} ${blk.id} ${blk.width} ${blk.height} ${blk.hue} ${
      blk.sat
    } ${blk.val} ${blk.zoomFactor} ${Number(blk.fillWithWalls)} ${Number(
      blk.player
    )} ${Number(blk.possessable)} ${blk.playerOrder} ${Number(
      blk.flipH
    )} ${Number(blk.floatInSpace)} ${Number(blk.specialEffect)}`,
  Ref: (ref) =>
    `Ref ${ref.x} ${ref.y} ${ref.id} ${Number(ref.exitBlock)} ${Number(
      ref.infExit
    )} ${ref.infExitNum} ${Number(ref.infEnter)} ${ref.infEnterNum} ${
      ref.infEnterId
    } ${Number(ref.player)} ${Number(ref.possessable)} ${
      ref.playerOrder
    } ${Number(ref.flipH)} ${Number(ref.floatInSpace)} ${ref.specialEffect}`,
  Wall: (wall) =>
    `Wall ${wall.x} ${wall.y} ${Number(wall.player)} ${Number(
      wall.possessable
    )} ${wall.playerOrder}`,
  Floor: (floor) => `Floor ${floor.x} ${floor.y} ${floor.floorType}`,
};

function encodeBody(root: LevelRoot): string {
  let lines = encodeBodyImpl(root.children, 0, []);
  lines.push("");
  return lines.join("\n");
}

function encodeBodyImpl(
  children: AnyBlock[],
  depth: number,
  lines: string[]
): string[] {
  for (const node of children) {
    const encode = ENCODE_BODY_LINE[node.blockType];
    if (encode === undefined) {
      throw new TypeError("unknown block type: " + node.blockType);
    }

    lines.push(`${"\t".repeat(depth)}${encode(node)}`);

    if (node.blockType === "Block") {
      let blkNode = node as RawBlock;
      encodeBodyImpl(blkNode.children, depth + 1, lines);
    }
  }
  return lines;
}

function arrEq(arr1: any[], arr2: any[]): boolean {
  return arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i]);
}
