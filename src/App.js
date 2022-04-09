import React, { useState } from "react";
import { inputSaveFile, outputSaveFile } from "./save-file-io";
import { Layout, Menu, PageHeader } from "antd";
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
          <Menu theme="dark" mode="horizontal" selectable={false}>
            <SubMenu key="file" title="File">
              <Menu.Item key="new">New</Menu.Item>
              <Menu.Item key="open">Open</Menu.Item>
              <Menu.Item key="save">Save</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        <Content className="stretch-height"></Content>
      </Layout>
    </>
  );
}
export default App;
