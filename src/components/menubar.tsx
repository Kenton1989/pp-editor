import { Menu, MenuProps, message } from "antd";
import React, { PropsWithChildren, useCallback } from "react";
import Hotkeys from "react-hot-keys";
import { useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";
import { useAppSelector } from "../app/hook";
import { inputLevelFile, outputLevelFile } from "../game-level-file";
import { LEVEL } from "../models/edit-level";
import {
  exportLevelState,
  importLevelState,
  loadLevelStateFromJson,
} from "../models/edit-level/io";
import levelStateSchema from "../models/edit-level/level-state-schema";
import { LevelState } from "../models/edit-level/state";
import { inputTxtFile, outputTxtFile } from "../text-io";
import "./menubar.css";
import Ajv from "ajv";
const { SubMenu } = Menu;
const MAX_FILE_SIZE = 1 << 20; // 1mb;

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
    let title = TITLE[key];
    return (
      <Menu.Item key={key}>
        {title ?? key}
        {shortCut && (
          <Hotkeys
            keyName={shortCut}
            onKeyDown={() => handleAction(key)}
            allowRepeat
          >
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
        {makeItem("save")}
        {makeItem("import")}
        {makeItem("export")}
      </SubMenu>
      <SubMenu key="edit" title="Edit">
        {makeItem("undo")}
        {makeItem("redo")}
      </SubMenu>
      <SubMenu key="help" title="Helps">
        <Menu.Item key="shortcuts">
          <BlankA href="https://github.com/Kenton1989/pp-editor#keyboard-shortcuts">
            Keyboard Shortcuts
          </BlankA>
        </Menu.Item>
        <Menu.Item key="json-txt-file">
          <BlankA href="https://github.com/Kenton1989/pp-editor#save-json-vs-save-txt">
            Save .json vs. Save .txt?
          </BlankA>
        </Menu.Item>
        <Menu.Item key="property-mean">
          <BlankA href="https://www.patricksparabox.com/custom-levels/#file-format">
            Explanation of Each Properties
          </BlankA>
        </Menu.Item>
        <Menu.Item key="load-level">
          <BlankA href="https://www.patricksparabox.com/custom-levels/#load">
            Load &amp; Play Customized Level
          </BlankA>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="about" title="About">
        <Menu.Item key="official-editor">
          <BlankA href="https://www.patricksparabox.com/custom-levels/">
            Official Customized Level Manual
          </BlankA>
        </Menu.Item>
        <Menu.Item key="source-code">
          <BlankA href="https://github.com/Kenton1989/pp-editor">
            Parabox Editor Source Code
          </BlankA>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
}

function BlankA(props: PropsWithChildren<React.HTMLProps<HTMLAnchorElement>>) {
  return (
    <a target="_blank" rel="noreferrer" {...props}>
      {props.children}
    </a>
  );
}

const ID = {
  new: "new" as "new",
  open: "open" as "open",
  save: "save" as "save",
  undo: "undo" as "undo",
  redo: "redo" as "redo",
  import: "import" as "import",
  export: "export" as "export",
};

const TITLE: { [k: string]: string } = {
  open: "open .json",
  save: "save .json",
  import: "open .txt",
  export: "save .txt",
};

const SHORTCUT: { [k: string]: string } =
  window.navigator.userAgent.indexOf("Mac") >= 0
    ? {
        save: "command+alt+s",
        export: "command+shift+s",
        undo: "command+z",
        redo: "command+shift+z",
      }
    : {
        save: "ctrl+alt+s",
        export: "ctrl+shift+s",
        undo: "ctrl+z",
        redo: "ctrl+shift+z",
      };

document.body.onkeydown = (e) => {
  // prevent default undo action
  if (e.ctrlKey && e.key === "z") {
    e.preventDefault();
  }
  if (e.metaKey && e.key === "z") {
    e.preventDefault();
  }
};

function useActionHandler(): (name: string) => any {
  const dispatch = useDispatch();
  const levelState = useAppSelector((state) => state.level.present);

  let cb = useCallback(
    async (name: string) => {
      if (name === ID.undo) {
        dispatch(ActionCreators.undo());
      } else if (name === ID.redo) {
        dispatch(ActionCreators.redo());
      } else if (name === ID.save) {
        let s = JSON.stringify(levelState);
        await outputTxtFile(s, levelState.header.title, "application/json");
      } else if (name === ID.export) {
        let root = exportLevelState(levelState);
        await outputLevelFile(root, levelState.header.title);
      } else if (name === ID.new) {
        dispatch(LEVEL.reset());
      } else if (name === ID.open) {
        let state = await openLevelStateFile();
        if (!state) return;
        dispatch(LEVEL.reset(state));
      } else if (name === ID.import) {
        try {
          let [raw, title] = await inputLevelFile();
          let state = importLevelState(raw, title);
          dispatch(LEVEL.reset(state));
        } catch (e: any) {
          message.error("cannot open level file:" + e);
          return;
        }
      }
    },
    [dispatch, levelState]
  );
  return cb;
}

async function openLevelStateFile(): Promise<LevelState | undefined> {
  try {
    let [s] = await inputTxtFile("application/json", MAX_FILE_SIZE);
    return loadLevelStateFromJson(s);
  } catch (e) {
    console.error(e);
    message.error("invalid file format");
  }
}
