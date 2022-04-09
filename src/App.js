import React, { useState } from "react";
import { inputSaveFile, outputSaveFile } from "./save-file-io";
import { Layout, Menu, PageHeader } from "antd";
import MenuBar from "./components/menubar";
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
        <Content className="stretch-height"></Content>
      </Layout>
    </>
  );
}
export default App;
