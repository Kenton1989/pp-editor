import { PropsWithChildren } from "react";
import { useBlockColor, useCurrentCell } from "../app/selector";
import { floorColor } from "./block-render-config";
import "./map-editor.css";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./const";
import { Cell } from "../models/edit-level/cell";
import { BlockCellPreview } from "./block-preview";
import { BlockState } from "../models/edit-level/state";
import { Empty } from "antd";
import { useDispatch } from "react-redux";
import { UI } from "../models/edit-ui";

export default function MapEditor(props: {}) {
  let [blk, cell] = useCurrentCell();
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
        scale={blk.zoomFactor}
        backgroundColor={floorColor(color)}
        renderCell={(x, y) => (
          <BlockCell
            parent={blk!}
            cell={blk!.grid[x][y]}
            selectable
            selected={cell && x === cell.x && y === cell.y}
          />
        )}
      />
    </div>
  );
}

function EditorGrid(props: {
  w: number;
  h: number;
  backgroundColor: string;
  scale?: number;
  renderCell?: (x: number, y: number) => JSX.Element | null;
}) {
  let { w, h, scale = 1, renderCell = () => <></>, backgroundColor } = props;

  return (
    <div
      className="map-grid"
      style={{ backgroundColor, transform: `scale(${scale})` }}
    >
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

function BlockCell(props: {
  parent: BlockState;
  cell: Cell | undefined;
  selected?: boolean;
  selectable?: boolean;
  className?: string;
}) {
  const { parent, cell, selected, selectable, className = "" } = props;
  const color = useBlockColor(parent);
  const dispatch = useDispatch();

  if (!cell) {
    return <></>;
  }

  const cls =
    className +
    " map-block" +
    (selectable ? " selectable" : "") +
    (selected ? " selected" : "");

  return (
    <div
      className={cls}
      onClick={() => {
        dispatch(UI.selectCell([cell.x, cell.y]));
      }}
    >
      <BlockCellPreview cell={cell} parentColor={color} />
    </div>
  );
}
