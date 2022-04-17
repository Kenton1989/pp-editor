import { Button, Image, List, Radio, Space, Typography } from "antd";
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

const SIMPLE_BRUSHES: [Brush, JSX.Element][] = [
  [DEFAULT_BRUSH.select, <SelectOutlined />],
  [DEFAULT_BRUSH.erase, <Icon component={EraserSvg} />],
  [DEFAULT_BRUSH.wall, <Icon component={WallSvg} />],
  [DEFAULT_BRUSH.box, <Icon component={BoxSvg} />],
  [DEFAULT_BRUSH.player, <Icon component={PlayerSvg} />],
  [DEFAULT_BRUSH.floor, <Icon component={PlayerFloorSvg} />],
];

export default function BrushMenu(props: {}) {
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
        dataSource={[...Array(20)].map((v, i) => i)}
        renderItem={(id) => (
          <BlockBrushRadio
            block={{
              id: id,
              name: `Block ${id}`,
              width: 0,
              height: 0,
              hsl: "box",
              zoomFactor: 1,
              fillWithWalls: false,
              floatInSpace: false,
              specialEffect: 0,
              grid: [],
            }}
          />
        )}
        footer={
          <Space align="center" direction="vertical">
            <Button size="large">+ New Block</Button>
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

let Text = Typography.Text;

function BlockBrushRadio(props: { block: BlockState }) {
  let { block } = props;
  return (
    <Radio.Button value={block.id} className="block-radio">
      <div className="block-radio-content">
        <Image
          src="/logo192.png"
          alt="logo"
          className="block-preview"
          preview={false}
        />
        <Text className="block-name">{block.name}</Text>
        <Button className="block-edit-btn" size="small">
          <EditOutlined />
        </Button>
      </div>
    </Radio.Button>
  );
}
