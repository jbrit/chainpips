import type { NextPage } from "next";
import Head from "next/head";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
const { Header, Sider, Content } = Layout;

const Home: NextPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className="layout">
      <Head>
        <title>ChainPips</title>
        <meta name="description" content="Permissionless Forex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={collapsed ? { fontSize: "16px" } : {}} className="logo">
          Chain{collapsed && <br/>}Pips
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
