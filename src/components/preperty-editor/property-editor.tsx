import "./property-editor.css";
import { Empty } from "antd";
import { useBrush, useCurrentCell } from "../../app/selector";
import { toBlockBrush } from "../../models/edit-ui/brush";
import BlockProps from "./block-properties";
import CellProps from "./cell-properties";
import BrushProps from "./brush-properties";

export default function PropertyEditor(props: {}) {
  let [blk, cell] = useCurrentCell();
  let brush = useBrush();

  let sectionCnt = 0;
  if (blk !== undefined) ++sectionCnt;
  if (cell !== undefined) ++sectionCnt;
  if (toBlockBrush(brush)) ++sectionCnt;
  let sizePercent = Math.round(100 / sectionCnt);

  return (
    <div id="property-editor">
      {sectionCnt === 0 && <Empty description="No Properties Data" />}
      <BlockProps blk={blk} sizePercent={sizePercent} />
      <CellProps parentBlk={blk} cell={cell} sizePercent={sizePercent} />
      <BrushProps brush={brush} sizePercent={sizePercent} />
    </div>
  );
}
