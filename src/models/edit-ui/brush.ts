import {
  RefCell,
  WallCell,
  FloorCell,
  SimplePlayerCell,
  BoxCell,
} from "../edit-level/cell";
import { HslColor } from "../edit-level/color";

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

export type Brush =
  | SelectBrush
  | EraseBrush
  | RefBrush
  | WallBrush
  | FloorBrush
  | SimplePlayerBrush
  | BoxBrush;

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
