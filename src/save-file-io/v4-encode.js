import { DEFAULT_ATTEMPT_ORDER, DEFAULT_HEADER } from "./v4-const";

export default function encodeSave(saveObj) {
  let header = encodeHeader(saveObj);
  console.log(saveObj, header)
  return header;
}

const ENCODE_HEADER_LINES = [
  ["version", (version) => `version ${version}\n`],
  [
    "attemptOrder",
    (attemptOrder) =>
      arrEq(attemptOrder, DEFAULT_ATTEMPT_ORDER)
        ? ""
        : `attempt_order ${attemptOrder.join(",")}\n`,
  ],
  ["shed", (shed) => (shed ? "shed\n" : "")],
  ["innerPush", (innerPush) => (innerPush ? "inner_push\n" : "")],
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

function encodeHeader(headers = DEFAULT_HEADER) {
  let res = "";
  for (const [propKey, encodeLine] of ENCODE_HEADER_LINES) {
    res += encodeLine(headers[propKey]);
  }
  res += "#\n";
  return res;
}

function arrEq(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i]);
}
