import { useAppDispatch } from "../../app/hook";
import { UI } from "../../models/edit-ui";
import { Brush, toBlockBrush } from "../../models/edit-ui/brush";
import { BrushEdit } from "../../models/edit-ui/slice";
import BrushCellSharedProps from "./brush-cell-shared-properties";
import { CELL_TYPE_DISPLAY_NAME, PropRow, PropSecTitle } from "./common";

export default function BrushProps(props: {
  brush: Brush;
  sizePercent: number;
}) {
  let { brush: rawBrush, sizePercent } = props;

  let dispatch = useAppDispatch();

  let editBrush = (arg: BrushEdit) => dispatch(UI.updateBrush(arg));

  let brush = toBlockBrush(rawBrush);
  if (!brush) {
    return <></>;
  }

  return (
    <div
      className="brush-property prop-editor-section"
      style={{
        height: `${sizePercent}%`,
      }}
    >
      <PropSecTitle>Brush Properties</PropSecTitle>
      <div className="prop-editor-content">
        <PropRow label="Type">
          {CELL_TYPE_DISPLAY_NAME[brush.brushType]}
        </PropRow>
        <BrushCellSharedProps data={brush} updater={editBrush} />
      </div>
    </div>
  );
}
