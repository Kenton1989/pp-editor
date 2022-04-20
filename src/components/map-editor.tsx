import { PropsWithChildren, useState } from "react";
import { useBlockColor, useCurrentBlk } from "../app/selector";
import { floorColor } from "./block-render-config";
import "./map-editor.css";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./const";
import { Cell } from "../models/edit-level/cell";
import { BlockCellPreview } from "./block-preview";
import { BlockState } from "../models/edit-level/state";
import { Empty } from "antd";

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

  return (
    <div id="map-editor">
      <EditorGrid
        w={blk.width}
        h={blk.height}
        backgroundColor={floorColor(color)}
        renderCell={(x, y) => (
          <BlockCell parent={blk!} cell={blk!.grid[x][y]} />
        )}
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

function BlockCell(props: { parent: BlockState; cell: Cell | undefined }) {
  const { parent, cell } = props;
  const color = useBlockColor(parent);

  if (!cell) {
    return <></>;
  }

  return (
    <BlockCellPreview
      cell={cell}
      parentColor={color}
      className="map-block selectable"
    />
  );
}
