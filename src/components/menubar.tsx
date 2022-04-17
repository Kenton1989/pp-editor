import { Menu, MenuProps } from "antd";
import { useCallback } from "react";
import Hotkeys from "react-hot-keys";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/hook";
import { outputLevelFile } from "../game-level-file";
import { LEVEL } from "../models/edit-level";
import { exportLevelState } from "../models/edit-level/io";
import { inputTxtFile, outputTxtFile } from "../text-io";
import "./menubar.css";

const { SubMenu } = Menu;

export default function MenuBar(props: MenuProps) {
  const { ...otherProps } = props;
  const handleAction = useActionHandler();
  const menuProps: MenuProps = {
    theme: "dark",
    mode: "horizontal",
    selectable: false,
    onClick: ({ key }) => handleAction(key),
    forceSubMenuRender: true, // to load shortcut
    ...otherProps,
  };

  function makeItem(key: keyof typeof ID) {
    let shortCut = SHORTCUT[key];
    return (
      <Menu.Item key={key}>
        {key}{" "}
        {shortCut && (
          <Hotkeys keyName={shortCut} onKeyDown={() => handleAction(key)}>
            <span className="action-item-shortcut">{shortCut}</span>
          </Hotkeys>
        )}
      </Menu.Item>
    );
  }

  return (
    <Menu {...menuProps}>
      <SubMenu key="file" title="File">
        {makeItem("new")}
        {makeItem("open")}
        {makeItem("import")}
        {makeItem("save")}
        {makeItem("export")}
      </SubMenu>
      <SubMenu key="edit" title="Edit">
        {makeItem("undo")}
        {makeItem("redo")}
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
  import: "import",
  export: "export",
};

const SHORTCUT: { [k: string]: string } =
  window.navigator.userAgent.indexOf("Mac") >= 0
    ? {
        save: "command+shift+s",
        undo: "command+z",
        redo: "command+shift+z",
        export: "command+shift+e",
      }
    : {
        save: "ctrl+shift+s",
        undo: "ctrl+z",
        redo: "ctrl+shift+z",
        export: "ctrl+shift+e",
      };

function useActionHandler(): (name: string) => any {
  const dispatch = useDispatch();
  const levelState = useAppSelector((state) => state.level.present);

  let cb = useCallback(
    async (name: string) => {
      console.log(name);
      if (name === ID.save) {
        let root = exportLevelState(levelState);
        await outputLevelFile(root, levelState.header.title);
      } else if (name === ID.export) {
        let s = JSON.stringify(levelState);
        await outputTxtFile(s, levelState.header.title, "application/json");
      } else if (name === ID.new) {
        dispatch(LEVEL.reset());
      } else if (name === ID.open) {
        await inputTxtFile("application/json");
      }

      // open: "open",
      // save: "save",
      // undo: "undo",
      // redo: "redo",
      // export: "export",
    },
    [dispatch, levelState]
  );
  return cb;
}
