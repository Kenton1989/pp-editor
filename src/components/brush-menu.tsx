import { Button, Col, List, Radio, Row } from "antd";
import "./brush-menu.css";
import Icon, {
  DeleteOutlined,
  EditOutlined,
  FormatPainterOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import { ReactComponent as WallSvg } from "./asset/wall-brush.svg";
import { ReactComponent as PlayerSvg } from "./asset/player-brush.svg";
import { ReactComponent as BoxSvg } from "./asset/box-brush.svg";
import { ReactComponent as FloorSvg } from "./asset/floor-brush.svg";
import { ReactComponent as EraserSvg } from "./asset/eraser-brush.svg";
import { Brush, DEFAULT_BRUSH } from "../models/edit-ui/brush";
import { BlockState } from "../models/edit-level/state";
import { PropsWithChildren, useEffect } from "react";
import { useAppDispatch } from "../app/hook";
import { LEVEL } from "../models/edit-level";
import { BlockPreview } from "./block-preview";
import { UI } from "../models/edit-ui";
import { useBlockList, useBrush, useCurrentBlk } from "../app/selector";
import ReactHotkeys from "react-hot-keys";

const SIMPLE_BRUSHES: [Brush, JSX.Element, string][] = [
  [DEFAULT_BRUSH.select, <SelectOutlined />, "f"],
  [DEFAULT_BRUSH.erase, <Icon component={EraserSvg} />, "d"],
  [DEFAULT_BRUSH.wall, <Icon component={WallSvg} />, "r"],
  [DEFAULT_BRUSH.box, <Icon component={BoxSvg} />, "e"],
  [DEFAULT_BRUSH.player, <Icon component={PlayerSvg} />, "w"],
  [DEFAULT_BRUSH.floor, <Icon component={FloorSvg} />, "q"],
];

export default function BrushMenu(props: {}) {
  let blocks = useBlockList();
  let dispatch = useAppDispatch();
  let curBlk = useCurrentBlk();
  let brush = useBrush();

  useEffect(() => {
    if (blocks.length > 0 && curBlk === undefined) {
      dispatch(UI.selectBlk(blocks[0].id));
    }
  });

  let brushKey: string | number = brush.brushType;
  if (brush.brushType === "Ref") {
    brushKey = brush.id;
  }

  return (
    <Radio.Group
      className="brush-menu"
      buttonStyle="solid"
      size="small"
      value={brushKey}
    >
      <List
        id="simple-brushes"
        dataSource={SIMPLE_BRUSHES}
        renderItem={([brush, icon, hotKey]) => (
          <SimpleBrushRadio brush={brush} hotKey={hotKey}>
            {icon}
          </SimpleBrushRadio>
        )}
      ></List>
      <List
        id="ref-brushes"
        dataSource={blocks}
        renderItem={(blk) => <BlockBrushRadio block={blk} />}
        footer={
          <div className="apply-flex-centers">
            <Button size="large" onClick={() => dispatch(LEVEL.createBlk())}>
              + New Block
            </Button>
          </div>
        }
      />
      {Array.from({ length: 10 }, (v, i) => (
        <ReactHotkeys
          key={i}
          keyName={`${(i + 1) % 10}`}
          onKeyDown={() => {
            if (i >= blocks.length) return;
            dispatch(UI.setBrush({ ...DEFAULT_BRUSH.ref, id: blocks[i].id }));
          }}
        />
      ))}
    </Radio.Group>
  );
}

function SimpleBrushRadio(
  props: PropsWithChildren<{ brush: Brush; hotKey: string }>
) {
  let { brush, children, hotKey } = props;
  const dispatch = useAppDispatch();
  let selectBrush = () => dispatch(UI.setBrush(brush));

  return (
    <Radio.Button
      value={brush.brushType}
      className="simple-radio"
      onClick={selectBrush}
    >
      <ReactHotkeys keyName={hotKey} onKeyDown={selectBrush} />
      {children}
    </Radio.Button>
  );
}

function BlockBrushRadio(props: { block: BlockState }) {
  let { block } = props;
  let curBlk = useCurrentBlk();
  let dispatch = useAppDispatch();
  let selected = curBlk && curBlk.id === block.id;

  return (
    <div
      className="block-radio-content"
      onClick={() => dispatch(UI.selectBlk(block.id))}
    >
      <BlockPreview className="block-preview" block={block} />
      <span className="block-summary">
        <Row>
          <Col span={24}>
            <span className="block-name">{block.name}</span>
          </Col>
          <Col span={24} className="block-action-btn-list">
            <Button
              size="small"
              className="block-edit-btn"
              type={selected ? "primary" : "default"}
              onClick={() => {
                dispatch(UI.selectBlk(block.id));
              }}
            >
              {curBlk && curBlk.id === block.id ? (
                "Editing"
              ) : (
                <>
                  <EditOutlined />
                  Edit
                </>
              )}
            </Button>
            <Radio.Button
              value={block.id}
              className="block-radio"
              onClick={() =>
                dispatch(UI.setBrush({ ...DEFAULT_BRUSH.ref, id: block.id }))
              }
            >
              <FormatPainterOutlined />
              Brush
            </Radio.Button>
            <Button
              size="small"
              onClick={() => {
                dispatch(LEVEL.removeBlk(block.id));
              }}
            >
              <DeleteOutlined />
            </Button>
          </Col>
        </Row>
      </span>
    </div>
  );
}
