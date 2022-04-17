import { List, Menu } from "antd";
import "./brush-menu.css";
import Icon, { DeleteOutlined, SelectOutlined } from "@ant-design/icons";
import { ReactComponent as WallSvg } from "./asset/wall-brush.svg";
import { ReactComponent as PlayerSvg } from "./asset/player-brush.svg";
import { ReactComponent as BoxSvg } from "./asset/box-brush.svg";
import { ReactComponent as FloorSvg } from "./asset/floor-brush.svg";
import { ReactComponent as PlayerFloorSvg } from "./asset/playerfloor-brush.svg";
import { DEFAULT_BRUSH } from "../models/edit-ui/brush";

export default function BrushMenu(props: {}) {
  let list = Array(10)
    .fill(0)
    .map((v, i) => ({
      key: i,
    }));
  return (
    <div className="brush-menu">
      <Menu
        mode="inline"
        defaultSelectedKeys={[]}
        inlineCollapsed
        id="simple-brushes"
      >
        <Menu.Item
          key={DEFAULT_BRUSH.select.brushType}
          icon={<SelectOutlined />}
        />
        <Menu.Item key="2" icon={<DeleteOutlined />} />
        <Menu.Item key="3" icon={<Icon component={WallSvg} />} />
        <Menu.Item key="4" icon={<Icon component={PlayerSvg} />} />
        <Menu.Item key="5" icon={<Icon component={BoxSvg} />} />
        <Menu.Item key="6" icon={<Icon component={FloorSvg} />} />
        <Menu.Item key="7" icon={<Icon component={PlayerFloorSvg} />} />
      </Menu>

      <div id="ref-brushes">
        <List
          dataSource={list}
          rowKey="key"
          renderItem={(item) => (
            <List.Item key={item.key}>
              <p>Item: {item.key}</p>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
