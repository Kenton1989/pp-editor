import Color from "color";

export const MAX_RECURSIVE_RENDER_LEVEL = 5;
export const [CANVAS_WIDTH, CANVAS_HEIGHT] = [300, 300];

export const [L_EYE_X_OFFEST, R_EYE_X_OFFSET, EYE_Y_OFFSET] = [0.3, 0.7, 0.45];
export const [EYE_RADIUS, PUPIL_RADIUS] = [0.08, 0.05];
export const eyeColor = (color: Color) => color.darken(0.7).string();

export const wallColor = (color: Color) => color.string();
export const WALL_LIGHT_OVERLAY = "rgba(255,255,255,0.6)";
export const WALL_SHADE_OVERLAY = "rgba(0,0,0,0.6)";
export const WALL_CENTER_WIDTH = 0.5;

export const borderColor = (color: Color) => color.darken(0.7).string();
export const BORDER_WIDTH = 0.03;

export const INF_OVERLAY_COLOR = "rgba(0,0,0,0.4)";
export const CLONE_OVERLAY_COLOR = "rgba(255,255,255,0.4)";

export const floorColor = (color: Color) =>
  color.darken(0.5).desaturate(0.33).string();

export const TARGET_FLOOR_OVERLAY_COLOR = "rgba(255,255,255,0.5)";
export const TARGET_FLOOR_BORDER_PADDING = 0.06;
export const TARGET_FLOOR_BORDER_WIDTH = 0.07;
