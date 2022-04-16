import {
  RefCell,
  WallCell,
  FloorCell,
  SimplePlayerCell,
  BoxCell,
} from "../edit-level/types";

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

export const DEFAULT_BRUSH: { [k: string]: Brush } = {
  select: {
    brushType: "Select",
  },
  erase: {
    brushType: "Erase",
  },
  wall: {
    brushType: "Wall",
    player: false,
    possessable: false,
    playerOrder: 0,
  },
  floor: {
    brushType: "Floor",
    floorType: "Button",
  },
  player: {
    brushType: "SimplePlayer",
    hsl: "player",
    playerOrder: 0,
  },
  box: {
    brushType: "Box",
    hsl: "box",
  },
  ref: {
    brushType: "Ref",
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
