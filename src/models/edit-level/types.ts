import {
  AnyBlock,
  Floor,
  LevelHeader,
  Ref,
  Wall,
} from "../../game-level-file/v4/types";

export type DefaultColor =
  | "root block"
  | "color A"
  | "color B"
  | "color C"
  | "box"
  | "player";

export type HslColor = [number, number, number] | DefaultColor;

export function toHslArr(color: HslColor): [number, number, number] {
  if (typeof color === "string") {
    switch (color) {
      case "root block":
        return [0, 0, 90];
      case "color A":
        return [213, 100, 60];
      case "color B":
        return [147, 100, 60];
      case "color C":
        return [193, 100, 60];
      case "box":
        return [40, 100, 60];
      case "player":
        return [324, 100, 40];
      default:
        throw new RangeError("unknown color name: ", color);
    }
  }
  return color as [number, number, number];
}

export function toHslStr(color: HslColor): string {
  let [h, s, l] = toHslArr(color);
  return `hsl(${h},${s}%,${l}%)`;
}

export interface HeaderState extends LevelHeader {
  title: string;
}

type OmitBlockType<T extends AnyBlock> = Omit<T, "blockType">;

export interface RefCell extends OmitBlockType<Ref> {
  cellType: "Ref";
}

export interface WallCell extends OmitBlockType<Wall> {
  cellType: "Wall";
}

export interface FloorCell extends OmitBlockType<Floor> {
  cellType: "Floor";
}

export interface SimplePlayerCell {
  cellType: "SimplePlayer";
  x: number;
  y: number;
  hsl: HslColor;
  playerOrder: number;
}

export interface BoxCell {
  cellType: "Box";
  x: number;
  y: number;
  hsl: HslColor;
}

export type Cell = RefCell | WallCell | FloorCell | SimplePlayerCell | BoxCell;

export type Grid = (Cell | undefined)[][];

export interface Block {
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
