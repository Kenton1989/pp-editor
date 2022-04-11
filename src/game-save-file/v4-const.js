const DEFAULT_HEADER = {
  blockType: "Root",
  version: "4",
  attemptOrder: ["push", "enter", "eat", "possess"],
  shed: false,
  innerPush: false,
  drawStyle: "",
  customLevelMusic: -1,
  customLevelPalette: -1,
};

const DEFAULT_ATTEMPT_ORDER = DEFAULT_HEADER.attemptOrder;
const ATTEMPT_NAMES = new Set(DEFAULT_ATTEMPT_ORDER);
const DRAW_STYLES = new Set(["", "tui", "grid", "oldstyle"]);

export {
    DEFAULT_HEADER,
    DEFAULT_ATTEMPT_ORDER,
    ATTEMPT_NAMES,
    DRAW_STYLES,
}