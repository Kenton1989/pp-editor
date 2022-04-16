import {
  AnyBlock,
  Floor,
  LevelHeader,
  Ref,
  Wall,
} from "../../game-level-file/v4/types";

type DefaultColor =
  | "default root"
  | "color A"
  | "color B"
  | "color C"
  | "box"
  | "player";
type Color = [number, number, number] | DefaultColor;

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
  rgb: Color;
  playerOrder: number;
}

export interface BoxCell {
  cellType: "Box";
  x: number;
  y: number;
  rgb: Color;
}

export type Cell = RefCell | WallCell | FloorCell | SimplePlayerCell | BoxCell;

export type Grid = (Cell | undefined)[][];

export interface Block {
  id: number;
  name: string;
  width: number;
  height: number;
  rgb: Color;
  zoomFactor: number;
  fillWithWalls: boolean;
  floatInSpace: boolean;
  grid: Grid;
}
