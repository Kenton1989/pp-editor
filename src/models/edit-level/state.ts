import { RawLevelHeader } from "../../game-level-file/v4/types";
import { Grid } from "./cell";
import { HslColor } from "./color";

export interface HeaderState extends RawLevelHeader {
  title: string;
}

export interface BlockState {
  id: number;
  name: string;
  width: number;
  height: number;
  hsl: HslColor;
  zoomFactor: number;
  fillWithWalls: boolean;
  floatInSpace: boolean;
  grid: Grid;
}

export interface LevelState {
  header: HeaderState;
  blocks: BlockState[];
  counter: number;
}

export const initialState: LevelState = {
  header: {
    version: "4",
    title: "level",
    attemptOrder: ["push", "enter", "eat", "possess"],
    shed: false,
    innerPush: false,
    drawStyle: "",
    customLevelMusic: -1,
    customLevelPalette: -1,
  },
  blocks: [],
  counter: 1,
};
