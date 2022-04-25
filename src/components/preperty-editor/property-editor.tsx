import "./property-editor.css";
import { Empty } from "antd";
import { useBrush, useCurrentCell } from "../../app/selector";
import { toBlockBrush } from "../../models/edit-ui/brush";
import BlockProps from "./block-properties";
import CellProps from "./cell-properties";
import BrushProps from "./brush-properties";

export default function PropertyEditor(props: {}) {
  const [blk, cell] = useCurrentCell();
  const brush = useBrush();

  const showBlkProp = blk !== undefined;
  const showCellProp = cell !== undefined && brush.brushType === "Select";
  const showBrushProp = toBlockBrush(brush) !== undefined;

  const sectionCnt =
    Number(showBlkProp) + Number(showCellProp) + Number(showBrushProp);

  const sizePercent = Math.round(100 / sectionCnt);

  return (
    <div id="property-editor">
      {sectionCnt === 0 && <Empty description="No Properties Data" />}
      {showBlkProp && <BlockProps blk={blk} sizePercent={sizePercent} />}
      {showBlkProp && showCellProp && (
        <CellProps parentBlk={blk} cell={cell} sizePercent={sizePercent} />
      )}
      {showBrushProp && <BrushProps brush={brush} sizePercent={sizePercent} />}
    </div>
  );
}
