import { Menu, MenuProps, message } from "antd";
// import { Validator } from "jsonschema";
import { useCallback } from "react";
import Hotkeys from "react-hot-keys";
import { useDispatch } from "react-redux";
import { ActionCreators } from "redux-undo";
import { useAppSelector } from "../app/hook";
import { inputLevelFile, outputLevelFile } from "../game-level-file";
import { LEVEL } from "../models/edit-level";
import { exportLevelState, importLevelState } from "../models/edit-level/io";
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

const TITLE: { [k: string]: string } = {
  open: "open .json",
  save: "save .json",
  import: "import .txt",
  export: "export .txt",
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

let ajv = new Ajv();
let levelStateValidate = ajv.compile(levelStateSchema);

async function openLevelStateFile(): Promise<LevelState | undefined> {
  try {
    let [s] = await inputTxtFile("application/json", MAX_FILE_SIZE);
    let state: any = undefined;
    state = JSON.parse(s);
    if (!levelStateValidate(state)) {
      message.error("invalid file format");
    }
    return state as LevelState;
  } catch (e) {
    console.error(e);
    message.error("invalid file format");
  }
}
