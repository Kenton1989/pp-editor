import { Layout } from "antd";
import MenuBar from "./components/menubar";
import MapEditor from "./components/map-editor";
import BrushMenu from "./components/brush-menu";
import PropertyEditor from "./components/preperty-editor";

import "./App.css";
import { useEffect, useRef } from "react";
import { HeaderEditorEntry } from "./components/preperty-editor";
import { useLevel } from "./app/selector";
import { useAppDispatch } from "./app/hook";
import { LEVEL } from "./models/edit-level";
import { loadLevelStateFromJson } from "./models/edit-level/io";
const { Header, Content } = Layout;

const AUTO_SAVE_INTERVAL = 1000 * 60 * 5; // 5 minutes

export default function App() {
  let mainDivRef = useRef<HTMLElement>(null);

  let level = useLevel();
  let dispatch = useAppDispatch();

  // recover auto-saved state
  useEffect(() => {
    const saveStr = localStorage.getItem("auto-saved-state");
    if (!saveStr) {
      return;
    }
    try {
      dispatch(LEVEL.reset(loadLevelStateFromJson(saveStr)));
    } catch (e) {
      console.log("failed to load auto-saved state:", e, saveStr);
    }
  }, [dispatch]);

  // auto save
  useEffect(() => {
    const saveState = () => {
      localStorage.setItem("auto-saved-state", JSON.stringify(level));
    };
    window.addEventListener("beforeunload", saveState);

    const handle = setInterval(saveState, AUTO_SAVE_INTERVAL);
    return () => {
      window.removeEventListener("beforeunload", saveState);
      clearInterval(handle);
    };
  }, [level]);

  return (
    <>
      <Layout className="stretch-height">
        <Header>
          <div className="main-logo">
            <img src="./logo192.png" alt="logo" />
            <span>Patrick's Parabox Editor</span>
          </div>
          <MenuBar />
        </Header>
        <Content id="main-div" ref={mainDivRef}>
          <HeaderEditorEntry />
          <MapEditor />
          <BrushMenu />
          <PropertyEditor />
        </Content>
      </Layout>
    </>
  );
}
