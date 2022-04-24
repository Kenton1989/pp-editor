import React, { PropsWithChildren, useState } from "react";
import {
  useBlockColor,
  useBrush,
  useCurrentBlk,
  useCurrentBlkColor,
  useCurrentCell,
} from "../app/selector";
import { floorColor } from "./block-render-config";
import "./map-editor.css";
import {
  DragSourceHookSpec,
  DropTargetHookSpec,
  FactoryOrInstance,
  useDrag,
  useDrop,
} from "react-dnd";
import { ItemTypes } from "./const";
import { Cell } from "../models/edit-level/cell";
import { BlockCellPreview } from "./block-preview";
import { BlockState } from "../models/edit-level/state";
import { Empty } from "antd";
import { UI } from "../models/edit-ui";
import { Brush, toBlockBrush, toCell } from "../models/edit-ui/brush";
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

  const brush = useBrush();
  const curBlk = useCurrentBlk()!;
  const curColor = useCurrentBlkColor();
  const dispatch = useAppDispatch();

  const [hover, setHover] = useState(false);

  const [{ cellDraggingThrough }, dropRef] = useBlockDrop({
    accept: ItemTypes.BLOCK,
    drop: ({ x: srcX, y: srcY }) => {
      if (srcX === undefined || srcY === undefined) return;
      dispatch(
        LEVEL.moveCell({ blkId: curBlk.id, from: [srcX, srcY], to: [x, y] })
      );
    },
    collect: (monitor) => {
      let src = monitor.getItem();
      if (
        !monitor.isOver() ||
        src.x === undefined ||
        src.y === undefined ||
        (src.x === x && src.y === y)
      ) {
        return {
          cellDraggingThrough: undefined,
        };
      }
      let cell = curBlk.grid[src.x][src.y];
      return {
        cellDraggingThrough: cell,
      };
    },
  });

  let brushPreview: JSX.Element = <></>;
  let draggingPreview: JSX.Element = <></>;
  let onClick = () => {};

  if (hover) {
    let blkBrush = toBlockBrush(brush);
    if (blkBrush !== undefined) {
      let newCell = toCell(blkBrush, x, y);
      onClick = () =>
        dispatch(LEVEL.setCell({ cell: newCell, blkId: curBlk.id }));
      brushPreview = (
        <div className="map-block brush-preview-cell-overlay">
          <BlockCellPreview cell={newCell} parentColor={curColor} />
        </div>
      );
    }
  }

  if (cellDraggingThrough) {
    draggingPreview = (
      <div className="map-block dragging-preview-cell-overlay">
        <BlockCellPreview cell={cellDraggingThrough} parentColor={curColor} />
      </div>
    );
  }

  return (
    <div
      className={"map-cell"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      ref={dropRef}
    >
      {children}
      {brushPreview}
      {draggingPreview}
    </div>
  );
}

function BlockCell(props: { cell: Cell | undefined; className?: string }) {
  const { cell, className = "" } = props;
  const [x, y] = [cell && cell.x, cell && cell.y];

  const [curBlk, curCell] = useCurrentCell();
  const color = useBlockColor(curBlk);
  const brush = useBrush();

  const dispatch = useAppDispatch();

  const onClick = useOnBlockCellClick(curBlk!, cell!, brush, dispatch);

  const [{ dragging }, dragRef] = useBlockDrag({
    type: ItemTypes.BLOCK,
    item: { x, y },
    canDrag: () => brush.brushType === "Select",
    collect: (monitor) => ({
      dragging: monitor.isDragging(),
    }),
  });

  if (!cell) {
    return <></>;
  }

  const cls = classNames(className, "map-block", {
    selectable: brush.brushType === "Select",
    erasable: brush.brushType === "Erase",
    "dragging-src": dragging,
    selected: curCell && curCell.x === cell.x && curCell.y === cell.y,
  });

  return (
    <div className={cls} onClick={onClick} ref={dragRef}>
      <BlockCellPreview cell={cell} parentColor={color} />
    </div>
  );
}

function useOnBlockCellClick(
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
    default:
      return undefined;
  }
}

interface BlockDragItem {
  x?: number;
  y?: number;
}

type BlockDropResult = unknown;

function useBlockDrag<CollectedProps>(
  specArg: FactoryOrInstance<
    DragSourceHookSpec<BlockDragItem, BlockDropResult, CollectedProps>
  >,
  deps?: unknown[]
) {
  return useDrag<BlockDragItem, BlockDropResult, CollectedProps>(specArg, deps);
}

function useBlockDrop<CollectedProps>(
  specArg: FactoryOrInstance<
    DropTargetHookSpec<BlockDragItem, BlockDropResult, CollectedProps>
  >,
  deps?: unknown[]
) {
  return useDrop<BlockDragItem, BlockDropResult, CollectedProps>(specArg, deps);
}
