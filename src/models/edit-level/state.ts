import Block from "./block";
import { HeaderState } from "./header";

export interface LevelState {
  header: HeaderState;
  blocks: Block[];
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
