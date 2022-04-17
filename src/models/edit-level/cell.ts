import {
  AnyBlock,
  RawFloor,
  RawRef,
  RawWall,
} from "../../game-level-file/v4/types";
import { HslColor } from "./color";

type OmitBlockType<T extends AnyBlock> = Omit<T, "blockType">;

export interface RefCell extends OmitBlockType<RawRef> {
  cellType: "Ref";
}

export interface WallCell extends OmitBlockType<RawWall> {
  cellType: "Wall";
}

export interface FloorCell extends OmitBlockType<RawFloor> {
  cellType: "Floor";
}

export interface SimplePlayerCell {
  cellType: "SimplePlayer";
  x: number;
  y: number;
  hsl: HslColor;
  possessable: boolean;
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
