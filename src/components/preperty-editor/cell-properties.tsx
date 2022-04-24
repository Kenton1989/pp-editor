import { useAppDispatch } from "../../app/hook";
import { LEVEL } from "../../models/edit-level";
import { Cell } from "../../models/edit-level/cell";
import { CellEdit } from "../../models/edit-level/slice";
import { BlockState } from "../../models/edit-level/state";
import BrushCellSharedProps from "./brush-cell-shared-properties";
import { CELL_TYPE_DISPLAY_NAME, PropRow, PropSecTitle } from "./common";

export default function CellProps(props: {
  parentBlk?: BlockState;
  cell?: Cell;
  sizePercent: number;
}) {
  let { parentBlk: parent, cell, sizePercent } = props;

  let dispatch = useAppDispatch();
  let editCell = (edit: Omit<CellEdit, "blkId" | "x" | "y">) =>
    dispatch(
      LEVEL.updateCell({ blkId: parent!.id, x: cell!.x, y: cell!.y, ...edit })
    );

  if (!parent || !cell) {
    return <></>;
  }

  return (
    <div
      className="cell-property prop-editor-section"
      style={{
        height: `${sizePercent}%`,
      }}
    >
      <PropSecTitle>Cell Properties</PropSecTitle>
      <div className="prop-editor-content">
        <PropRow label="Type">{CELL_TYPE_DISPLAY_NAME[cell.cellType]}</PropRow>
        <PropRow label="Position">{`( ${cell.x} , ${cell.y} )`}</PropRow>
        <BrushCellSharedProps data={cell} updater={editCell} />
      </div>
    </div>
  );
}
