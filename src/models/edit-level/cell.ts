import { AnyBlock, Floor, Ref, Wall } from "../../game-level-file/v4/types";

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
  rgb: [number, number, number];
  playerOrder: number;
}

export interface BoxCell {
  cellType: "Box";
  x: number;
  y: number;
  rgb: [number, number, number];
}

type Cell = RefCell | WallCell | FloorCell | SimplePlayerCell | BoxCell;

export default Cell;
