import {
  RefCell,
  WallCell,
  FloorCell,
  SimplePlayerCell,
  BoxCell,
  Cell,
} from "../edit-level/cell";

type FromCell<T> = Omit<T, "cellType" | "x" | "y">;

export interface SelectBrush {
  brushType: "Select";
}

export interface EraseBrush {
  brushType: "Erase";
}

export interface RefBrush extends FromCell<RefCell> {
  brushType: "Ref";
}

export interface WallBrush extends FromCell<WallCell> {
  brushType: "Wall";
}

export interface FloorBrush extends FromCell<FloorCell> {
  brushType: "Floor";
}

export interface SimplePlayerBrush extends FromCell<SimplePlayerCell> {
  brushType: "SimplePlayer";
}

export interface BoxBrush extends FromCell<BoxCell> {
  brushType: "Box";
}

export type BlockBrush =
  | RefBrush
  | WallBrush
  | FloorBrush
  | SimplePlayerBrush
  | BoxBrush;

export type OperationBrush = SelectBrush | EraseBrush;

export type Brush = OperationBrush | BlockBrush;

export function toBlockBrush(brush: Brush): BlockBrush | undefined {
  switch (brush.brushType) {
    case "Select":
    case "Erase":
      return undefined;
    default:
      return brush;
  }
}

export function toOperationBrush(brush: Brush): OperationBrush | undefined {
  switch (brush.brushType) {
    case "Select":
    case "Erase":
      return brush;
    default:
      return undefined;
  }
}

export function toCell(brush: BlockBrush, x: number, y: number): Cell {
  let { brushType, ...data } = brush;
  return { cellType: brushType, x, y, ...data } as Cell;
}

export const DEFAULT_BRUSH = {
  select: {
    brushType: "Select" as "Select",
  },
  erase: {
    brushType: "Erase" as "Erase",
  },
  wall: {
    brushType: "Wall" as "Wall",
    player: false,
    possessable: false,
    playerOrder: 0,
  },
  floor: {
    brushType: "Floor" as "Floor",
    floorType: "Button" as "Button",
  },
  playerFloor: {
    brushType: "Floor" as "Floor",
    floorType: "PlayerButton" as "PlayerButton",
  },
  player: {
    brushType: "SimplePlayer" as "SimplePlayer",
    hsl: "player" as "player",
    player: true,
    possessable: true,
    playerOrder: 0,
  },
  box: {
    brushType: "Box" as "Box",
    hsl: "box" as "box",
  },
  ref: {
    brushType: "Ref" as "Ref",
    id: 0,
    exitBlock: true,
    infExit: false,
    infExitNum: 0,
    infEnter: false,
    infEnterNum: 0,
    infEnterId: 0,
    player: false,
    possessable: false,
    playerOrder: 0,
    flipH: false,
    floatInSpace: false,
    specialEffect: 0,
  },
};
