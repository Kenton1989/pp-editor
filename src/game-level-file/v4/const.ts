import { AttemptOrder, RawLevelHeader } from "./types";

const DEFAULT_HEADER: RawLevelHeader = {
  version: "4",
  attemptOrder: ["push", "enter", "eat", "possess"],
  shed: false,
  innerPush: false,
  drawStyle: "",
  customLevelMusic: 0,
  customLevelPalette: 0,
};

const DEFAULT_ATTEMPT_ORDER = DEFAULT_HEADER.attemptOrder;
const APPENDIX_PRIORITY_ATTEMPT_ORDER: AttemptOrder = [
  "enter",
  "eat",
  "push",
  "possess",
];

const ATTEMPT_NAMES = new Set(DEFAULT_ATTEMPT_ORDER);

export interface MusicInfo {
  id: number;
  name: string;
}

export const MUSICS: MusicInfo[] = [
  { id: 0, name: "Intro" },
  { id: 1, name: "Enter" },
  { id: 2, name: "Empty" },
  { id: 3, name: "Reference" },
  { id: 5, name: "Swap" },
  { id: 6, name: "Center" },
  { id: 7, name: "Clone" },
  { id: 8, name: "Transfer" },
  { id: 9, name: "Open" },
  { id: 10, name: "Flip" },
  { id: 11, name: "Cycle" },
  { id: 12, name: "Player" },
  { id: 13, name: "Possess" },
  { id: 14, name: "Wall" },
  { id: 15, name: "Infinite Exit" },
  { id: 16, name: "Infinite Enter" },
  { id: 17, name: "Multi Infinite" },
  { id: 18, name: "Reception" },
  { id: 19, name: "Appendix" },
  { id: 20, name: "Menu" },
  { id: 21, name: "Credit" },
];

function getMusic(id: number): MusicInfo {
  if (id < 0 || id > MUSICS.length) {
    return {
      id: id,
      name: "no music",
    };
  }
  return MUSICS[id];
}

export {
  DEFAULT_HEADER,
  DEFAULT_ATTEMPT_ORDER,
  APPENDIX_PRIORITY_ATTEMPT_ORDER,
  ATTEMPT_NAMES,
  getMusic,
};
