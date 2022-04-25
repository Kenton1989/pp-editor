import { Layout } from "antd";
import MenuBar from "./components/menubar";
import MapEditor from "./components/map-editor";
import BrushMenu from "./components/brush-menu";
import PropertyEditor from "./components/preperty-editor";

import "./App.css";
import { useRef } from "react";
import { HeaderEditorEntry } from "./components/preperty-editor";

const { Header, Content } = Layout;

function App() {
  let mainDivRef = useRef<HTMLElement>(null);

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
export default App;
