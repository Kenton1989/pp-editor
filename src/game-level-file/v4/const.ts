import { AttemptOrder, LevelHeader } from "./types";

const DEFAULT_HEADER: LevelHeader = {
  version: "4",
  attemptOrder: ["push", "enter", "eat", "possess"],
  shed: false,
  innerPush: false,
  drawStyle: "",
  customLevelMusic: -1,
  customLevelPalette: -1,
};

const DEFAULT_ATTEMPT_ORDER = DEFAULT_HEADER.attemptOrder;
const APPENDIX_PRIORITY_ATTEMPT_ORDER: AttemptOrder = [
  "enter",
  "eat",
  "push",
  "possess",
];

const ATTEMPT_NAMES = new Set(DEFAULT_ATTEMPT_ORDER);

const MUSIC = [
  { id: 0, name: "intro" },
  { id: 1, name: "enter" },
  { id: 2, name: "empty" },
  { id: 3, name: "eat" },
  { id: 4, name: "reference" },
  { id: 5, name: "swap" },
  { id: 6, name: "center" },
  { id: 7, name: "clone" },
  { id: 8, name: "transfer" },
  { id: 9, name: "open" },
  { id: 10, name: "flip" },
  { id: 11, name: "cycle" },
  { id: 12, name: "player" },
  { id: 13, name: "possess" },
  { id: 14, name: "wall" },
  { id: 15, name: "infinite exit" },
  { id: 16, name: "infinite enter" },
  { id: 17, name: "multi infinite" },
  { id: 18, name: "reception" },
  { id: 19, name: "appendix" },
  { id: 20, name: "menu" },
  { id: 21, name: "credit" },
];

export {
  DEFAULT_HEADER,
  DEFAULT_ATTEMPT_ORDER,
  APPENDIX_PRIORITY_ATTEMPT_ORDER,
  ATTEMPT_NAMES,
  MUSIC,
};
