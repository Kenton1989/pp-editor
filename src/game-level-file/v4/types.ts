export type AttemptAction = "push" | "enter" | "eat" | "possess";
const ATTEMPT_ACTIONS = new Set(["push", "enter", "eat", "possess"]);
export function isAttemptAction(s: string): boolean {
  return ATTEMPT_ACTIONS.has(s);
}

export type AttemptOrder = [
  AttemptAction,
  AttemptAction,
  AttemptAction,
  AttemptAction
];
export function isAttemptOrder(list: string[]): boolean {
  let valSet = new Set(list);
  if (valSet.size !== 4) return false;

  for (const s of valSet) {
    if (!isAttemptAction(s)) return false;
  }

  return true;
}

export type DrawStyle = "" | "tui" | "grid" | "oldstyle";
const DRAW_STYLES = new Set(["", "tui", "grid", "oldstyle"]);
export function isDrawStyle(s: string): boolean {
  return DRAW_STYLES.has(s);
}

export interface LevelHeader {
  version: "4" | 4;
  attemptOrder: AttemptOrder;
  shed: boolean;
  innerPush: boolean;
  drawStyle: DrawStyle;
  customLevelMusic: number;
  customLevelPalette: number;
}

export interface BaseBlock {
  blockType: string;
}

export type AnyBlock = Block | Ref | Wall | Floor;

export interface LevelRoot extends LevelHeader, BaseBlock {
  blockType: "Root";
  children: Block[];
}

export interface Block extends BaseBlock {
  blockType: "Block";
  x: number;
  y: number;
  id: number;
  width: number;
  height: number;
  hue: number;
  sat: number;
  val: number;
  zoomFactor: number;
  fillWithWalls: boolean;
  player: boolean;
  playerOrder: number;
  possessable: boolean;
  flipH: boolean;
  floatInSpace: boolean;
  specialEffect: number;
  children: AnyBlock[];
}

export interface Ref extends BaseBlock {
  blockType: "Ref";
  x: number;
  y: number;
  id: number;
  exitBlock: boolean;
  infExit: boolean;
  infExitNum: number;
  infEnter: boolean;
  infEnterNum: number;
  infEnterId: number;
  player: boolean;
  possessable: boolean;
  playerOrder: number;
  flipH: boolean;
  floatInSpace: boolean;
  specialEffect: number;
}

export interface Wall extends BaseBlock {
  blockType: "Wall";
  x: number;
  y: number;
  player: boolean;
  possessable: boolean;
  playerOrder: number;
}

export interface Floor extends BaseBlock {
  blockType: "Floor";
  x: number;
  y: number;
  floorType: "Button" | "PlayerButton";
}
