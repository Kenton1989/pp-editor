import Cell from "./cell";

interface Block {
  id: number;
  name: string;
  width: number;
  height: number;
  rgb: [number, number, number];
  zoomFactor: number;
  fillWithWalls: boolean;
  floatInSpace: boolean;
  grid: Cell[][];
}

export default Block;
