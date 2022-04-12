export interface Ref {
  cellType: "Ref";
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

export interface Wall {
  cellType: "Wall";
  x: number;
  y: number;
  player: boolean;
  possessable: boolean;
  playerOrder: number;
}

export type FloorType = "PlayerButton" | "Button";

export interface Floor {
  cellType: "Floor";
  x: number;
  y: number;
  floorType: FloorType;
}

export interface SimplePlayer {
  cellType: "SimplePlayer";
  x: number;
  y: number;
  rgb: [number, number, number];
  playerOrder: number;
}

export interface Box {
  cellType: "Box";
  x: number;
  y: number;
  rgb: [number, number, number];
}

type Cell = Ref | Wall | Floor | SimplePlayer | Box;

export default Cell;
