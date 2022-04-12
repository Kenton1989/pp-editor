import { Menu, MenuProps } from "antd";
import Hotkeys from "react-hot-keys";
import "./menubar.css";

const { SubMenu } = Menu;

export default function MenuBar(
  props: {
    onItemTriggered: (actions: string) => unknown;
  } & MenuProps
) {
  const { onItemTriggered = nothing, ...otherProps } = props;

  const menuProps: MenuProps = {
    theme: "dark",
    mode: "horizontal",
    selectable: false,
    onClick: ({ key }) => onItemTriggered(key),
    forceSubMenuRender: true, // to load shortcut
    ...otherProps,
  };

  function ShortCut(props: { id: string; shortCut: string }) {
    const { id, shortCut } = props;
    return (
      <Hotkeys keyName={shortCut} onKeyDown={() => onItemTriggered(id)}>
        <span className="action-item-shortcut">{shortCut}</span>
      </Hotkeys>
    );
  }

  return (
    <Menu {...menuProps}>
      <SubMenu key="file" title="File">
        <Menu.Item key={ID.new}>New</Menu.Item>
        <Menu.Item key={ID.open}>Open</Menu.Item>
        <Menu.Item key={ID.save}>
          Save <ShortCut id={ID.save} shortCut={SHORTCUT.save} />
        </Menu.Item>
      </SubMenu>
      <SubMenu key="edit" title="Edit">
        <Menu.Item key={ID.undo}>
          Undo <ShortCut id={ID.undo} shortCut={SHORTCUT.undo} />
        </Menu.Item>
        <Menu.Item key={ID.redo}>
          Redo <ShortCut id={ID.redo} shortCut={SHORTCUT.redo} />
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
}

const ID = {
  new: "new",
  open: "open",
  save: "save",
  undo: "undo",
  redo: "redo",
};

const SHORTCUT = {
  save: "ctrl+shift+s",
  undo: "ctrl+z",
  redo: "ctrl+shift+z",
};

function nothing() {}
