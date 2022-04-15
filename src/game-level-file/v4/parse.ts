import { FloorType } from "./types";
import { DEFAULT_HEADER } from "./const";
import {
  isDrawStyle,
  isAttemptOrder,
  LevelHeader,
  AttemptOrder,
  DrawStyle,
  LevelRoot,
  AnyBlock,
  Block,
} from "./types";

const HEADER_PARSE: {
  [k: string]: (tokens: string[], headers: LevelHeader) => unknown;
} = {
  version: (tokens, headers) => (headers.version = tokens[1] as "4"),
  attempt_order: (tokens, headers) =>
    (headers.attemptOrder = tokens[1].split(",") as AttemptOrder),
  shed: (tokens, headers) => (headers.shed = tokens[1] === "1"),
  inner_push: (tokens, headers) => (headers.innerPush = tokens[1] === "1"),
  draw_style: (tokens, headers) => (headers.drawStyle = tokens[1] as DrawStyle),
  custom_level_music: (tokens, headers) =>
    (headers.customLevelMusic = parseInt(tokens[1])),
  custom_level_palette: (tokens, headers) =>
    (headers.customLevelPalette = parseInt(tokens[1])),
};

const HEADER_CHECK: { [k: string]: (header: LevelHeader) => boolean } = {
  version: (headers) => headers.version === "4",
  attempt_order: (headers) => isAttemptOrder(headers.attemptOrder),
  shed: (headers) => typeof headers.shed === "boolean",
  inner_push: (headers) => typeof headers.innerPush === "boolean",
  draw_style: (headers) => isDrawStyle(headers.drawStyle),
  custom_level_music: (headers) => !isNaN(headers.customLevelMusic),
  custom_level_palette: (headers) => !isNaN(headers.customLevelPalette),
};

export default function parseLevel(txtData: string): LevelRoot {
  let txtLines = txtData
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.length !== 0);
  let tokenLines = txtLines.map((txtLine) => txtLine.split(/ +/));

  let result: LevelRoot = {
    blockType: "Root",
    children: [],
    ...DEFAULT_HEADER,
  };

  let lineNo = 0;
  for (const tokens of tokenLines) {
    let headerKey = tokens[0];
    ++lineNo;
    if (headerKey === "#") {
      break;
    }

    let parse = HEADER_PARSE[headerKey];
    let check = HEADER_CHECK[headerKey];
    if (parse === undefined || check === undefined) {
      throw new Error(`line ${lineNo}: unknown header: ${headerKey}`);
    }

    parse(tokens, result);
    if (!check(result)) {
      throw new Error(`line ${lineNo}: invalid header value: ${headerKey}`);
    }
  }
  parseBody(result, 0, tokenLines, lineNo);
  return result;
}

const PARSE_BLOCK: { [k: string]: (tokens: string[]) => AnyBlock } = {
  Block: (tokens) => ({
    // Block x y id width height hue sat val zoomfactor fillwithwalls player possessable playerorder fliph floatinspace specialeffect
    blockType: "Block",
    x: mustParseInt(tokens[1]),
    y: mustParseInt(tokens[2]),
    id: mustParseInt(tokens[3]),
    width: mustParseInt(tokens[4]),
    height: mustParseInt(tokens[5]),
    hue: mustParseFloat(tokens[6], 0, 1),
    sat: mustParseFloat(tokens[7], 0, 1),
    val: mustParseFloat(tokens[8], 0, 1),
    zoomFactor: mustParseFloat(tokens[9], 0, Infinity),
    fillWithWalls: tokens[10] === "1",
    player: tokens[11] === "1",
    possessable: tokens[12] === "1",
    playerOrder: mustParseInt(tokens[13]),
    flipH: tokens[14] === "1",
    floatInSpace: tokens[15] === "1",
    specialEffect: mustParseInt(tokens[16]),
    children: [],
  }),
  Ref: (tokens) => ({
    // Ref x y id exitblock infexit infexitnum infenter infenternum infenterid player possessable playerorder fliph floatinspace specialeffect
    blockType: "Ref",
    x: mustParseInt(tokens[1]),
    y: mustParseInt(tokens[2]),
    id: mustParseInt(tokens[3]),
    exitBlock: tokens[4] === "1",
    infExit: tokens[5] === "1",
    infExitNum: mustParseInt(tokens[6]),
    infEnter: tokens[7] === "1",
    infEnterNum: mustParseInt(tokens[8]),
    infEnterId: mustParseInt(tokens[9]),
    player: tokens[10] === "1",
    possessable: tokens[11] === "1",
    playerOrder: mustParseInt(tokens[12]),
    flipH: tokens[13] === "1",
    floatInSpace: tokens[14] === "1",
    specialEffect: mustParseInt(tokens[15]),
  }),
  Wall: (tokens) => ({
    // Wall x y player possessable playerorder
    blockType: "Wall",
    x: mustParseInt(tokens[1]),
    y: mustParseInt(tokens[2]),
    player: tokens[3] === "1",
    possessable: tokens[4] === "1",
    playerOrder: mustParseInt(tokens[5]),
  }),
  Floor: (tokens) => ({
    // Floor x y type(Button or PlayerButton)
    blockType: "Floor",
    x: mustParseInt(tokens[1]),
    y: mustParseInt(tokens[2]),
    floorType: mustIn(tokens[3], ["Button", "PlayerButton"]) as FloorType,
  }),
};

/**
 * parse a block/node from the body part of level
 *
 * @param {any} parent parent element
 * @param {number} depth the depth of the recursive call of parseBody
 * @param {string[][]} tokenLines tokens of each lines
 * @param {number} begLineNo the first line to be parsed
 * @returns {number} the last line of token that has been parsed into object
 */
function parseBody(
  parent: Block | LevelRoot,
  depth: number,
  tokenLines: string[][],
  begLineNo: number
): number {
  for (let i = begLineNo; i < tokenLines.length; ++i) {
    let tokens = tokenLines[i];
    let blockType = tokens[0].trim();
    let lineDepth = tokens[0].length - blockType.length;

    if (lineDepth < depth) {
      return i - 1;
    }

    if (lineDepth > depth) {
      let lastBlock = parent.children[parent.children.length - 1];
      if (!["Block", "Root"].includes(lastBlock.blockType)) {
        throw new Error(
          `line ${i + 1}: ${
            lastBlock.blockType
          } type block should not have children`
        );
      }
      i = parseBody(lastBlock as Block | LevelRoot, depth + 1, tokenLines, i);
      continue;
    }

    let parse = PARSE_BLOCK[blockType];
    if (parse === undefined) {
      throw new Error(`line ${i + 1}: unknown block type: ${blockType}`);
    }

    let newBlk = parse(tokens);
    if (parent.blockType === "Root" && newBlk.blockType !== "Block") {
      throw new Error(
        `line ${i + 1}: ${newBlk.blockType} should not appeared at the root`
      );
    }

    if (parent.blockType === "Root") parent.children.push(newBlk as Block);
    else (parent as Block).children.push(newBlk);
  }
  return tokenLines.length - 1;
}

function mustParseInt(str: string, radix?: number): number {
  let res = parseInt(str, radix);
  if (isNaN(res)) {
    throw new EvalError();
  }
  return res;
}

function mustParseFloat(str: string, min: number, max: number): number {
  let res = parseFloat(str);
  if (isNaN(res)) {
    throw new EvalError();
  }
  if (res < min || res > max) {
    throw new RangeError();
  }
  return res;
}

function mustIn<Type>(val: Type, list: Type[]): Type {
  if (list.some((v) => v === val)) {
    return val;
  }
  throw new RangeError();
}
