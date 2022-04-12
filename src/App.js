import React, { useState } from "react";
import { Layout, Menu, PageHeader } from "antd";
import MenuBar from "./components/menubar";
import MapEditor from "./components/map-editor";
import BrushMenu from "./components/brush-menu";
import PropertyEditor from "./components/property-editor";

import "./App.css";

const { SubMenu } = Menu;

const { Header, Footer, Sider, Content } = Layout;

function App() {
  // const [text, setText] = useState("");
  return (
    <>
      <Layout className="stretch-height">
        <Header>
          <div className="main-logo">
            <img src="/logo192.png" alt="logo" />
            <span>Parabox Editor</span>
          </div>
          <MenuBar onItemTriggered={(key) => console.log(key)} />
        </Header>
        <Content className="main-div">
          <MapEditor />
          <BrushMenu />
          <PropertyEditor />
        </Content>
      </Layout>
    </>
  );
}
export default App;
