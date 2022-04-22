import { PropsWithChildren } from "react";
import {
  useBlockColor,
  useBrush,
  useCurrentBlk,
  useCurrentCell,
} from "../app/selector";
import { floorColor } from "./block-render-config";
import "./map-editor.css";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./const";
import { Cell } from "../models/edit-level/cell";
import { BlockCellPreview } from "./block-preview";
import { BlockState } from "../models/edit-level/state";
import { Empty } from "antd";
import { UI } from "../models/edit-ui";
import { Brush } from "../models/edit-ui/brush";
import classNames from "classnames";
import { useAppDispatch } from "../app/hook";
import { LEVEL } from "../models/edit-level";

export default function MapEditor(props: {}) {
  let blk = useCurrentBlk();
  let color = useBlockColor(blk);

  if (blk === undefined) {
    return (
      <div id="map-editor">
        <Empty />
      </div>
    );
  }

  if (blk.fillWithWalls) {
    return (
      <div id="map-editor">
        <EditorGrid
          w={1}
          h={1}
          backgroundColor={color.string()}
          renderCell={(x, y) => null}
        />
      </div>
    );
  }

  return (
    <div id="map-editor">
      <EditorGrid
        w={blk.width}
        h={blk.height}
        backgroundColor={floorColor(color)}
        renderCell={(x, y) => <BlockCell cell={blk!.grid[x][y]} />}
      />
    </div>
  );
}

function EditorGrid(props: {
  w: number;
  h: number;
  backgroundColor: string;
  renderCell?: (x: number, y: number) => JSX.Element | null;
}) {
  let { w, h, renderCell = () => <></>, backgroundColor } = props;

  return (
    <div className="map-grid" style={{ backgroundColor }}>
      {Array.from({ length: w }, (v, x) => (
        <div className="map-axis" key={x}>
          {Array.from({ length: h }, (v, y) => (
            <MapCell key={y} x={x} y={y}>
              {renderCell(x, y)}
            </MapCell>
          ))}
        </div>
      ))}
    </div>
  );
}

function MapCell(props: PropsWithChildren<{ x: number; y: number }>) {
  const { x, y, children } = props;

  return <div className="map-cell">{children}</div>;
}

function BlockCell(props: { cell: Cell | undefined; className?: string }) {
  const { cell, className = "" } = props;

  const [curBlk, curCell] = useCurrentCell();
  const color = useBlockColor(curBlk);
  const brush = useBrush();

  const dispatch = useAppDispatch();

  const onClick = useOnCellClick(curBlk!, cell!, brush, dispatch);

  if (!cell) {
    return <></>;
  }

  const cls = classNames(className, "map-block", {
    selectable: brush.brushType === "Select",
    erasable: brush.brushType === "Erase",
    selected: curCell && curCell.x === cell.x && curCell.y === cell.y,
  });

  return (
    <div className={cls} onClick={onClick}>
      <BlockCellPreview cell={cell} parentColor={color} />
    </div>
  );
}

function useOnCellClick(
  parentBlk: BlockState,
  cell: Cell,
  brush: Brush,
  dispatch: ReturnType<typeof useAppDispatch>
) {
  switch (brush.brushType) {
    case "Select":
      return () => dispatch(UI.selectCell([cell.x, cell.y]));
    case "Erase":
      return () =>
        dispatch(
          LEVEL.removeCell({ blkId: parentBlk.id, pos: [cell.x, cell.y] })
        );
  }
}
