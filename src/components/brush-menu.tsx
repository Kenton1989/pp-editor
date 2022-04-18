import { Button, List, Radio, Space } from "antd";
import "./brush-menu.css";
import Icon, { EditOutlined, SelectOutlined } from "@ant-design/icons";
import { ReactComponent as WallSvg } from "./asset/wall-brush.svg";
import { ReactComponent as PlayerSvg } from "./asset/player-brush.svg";
import { ReactComponent as BoxSvg } from "./asset/box-brush.svg";
import { ReactComponent as PlayerFloorSvg } from "./asset/playerfloor-brush.svg";
import { ReactComponent as EraserSvg } from "./asset/eraser-brush.svg";
import { Brush, DEFAULT_BRUSH } from "../models/edit-ui/brush";
import { BlockState } from "../models/edit-level/state";
import { PropsWithChildren } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { LEVEL } from "../models/edit-level";
import { BlockPreview } from "./block-preview";
import { UI } from "../models/edit-ui";

const SIMPLE_BRUSHES: [Brush, JSX.Element][] = [
  [DEFAULT_BRUSH.select, <SelectOutlined />],
  [DEFAULT_BRUSH.erase, <Icon component={EraserSvg} />],
  [DEFAULT_BRUSH.wall, <Icon component={WallSvg} />],
  [DEFAULT_BRUSH.box, <Icon component={BoxSvg} />],
  [DEFAULT_BRUSH.player, <Icon component={PlayerSvg} />],
  [DEFAULT_BRUSH.floor, <Icon component={PlayerFloorSvg} />],
];

export default function BrushMenu(props: {}) {
  let blocks = useAppSelector((state) => state.level.present.blocks);
  let dispatch = useAppDispatch();

  return (
    <Radio.Group
      className="brush-menu"
      buttonStyle="solid"
      defaultValue={DEFAULT_BRUSH.select.brushType}
      onChange={(e) => console.log(e.target.value, typeof e.target.value)}
    >
      <List
        id="simple-brushes"
        dataSource={SIMPLE_BRUSHES}
        renderItem={([brush, icon]) => (
          <SimpleBrushRadio brush={brush}>{icon}</SimpleBrushRadio>
        )}
      ></List>
      <List
        id="ref-brushes"
        dataSource={blocks}
        renderItem={(blk) => <BlockBrushRadio block={blk} />}
        footer={
          <Space align="center" direction="vertical">
            <Button size="large" onClick={() => dispatch(LEVEL.createBlk())}>
              + New Block
            </Button>
          </Space>
        }
      ></List>
    </Radio.Group>
  );
}

function SimpleBrushRadio(props: PropsWithChildren<{ brush: Brush }>) {
  let { brush, children } = props;
  return (
    <Radio.Button value={brush.brushType} className="simple-radio">
      {children}
    </Radio.Button>
  );
}

function BlockBrushRadio(props: { block: BlockState }) {
  let { block } = props;
  let curBlk = useAppSelector((state) => state.ui.editingBlk);
  let dispatch = useAppDispatch();
  return (
    <Radio.Button value={block.id} className="block-radio">
      <div className="block-radio-content">
        <BlockPreview className="block-preview" block={block} />
        <span className="block-name">{block.name}</span>
        <Button
          className="block-edit-btn"
          size="small"
          disabled={curBlk === block.id}
          onClick={() => {
            dispatch(UI.selectBlk(block.id));
          }}
        >
          <EditOutlined />
        </Button>
      </div>
    </Radio.Button>
  );
}
