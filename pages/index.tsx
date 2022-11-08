import type { NextPage } from "next";
import Head from "next/head";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Chart from "$components/Chart";
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
        <div style={collapsed ? { fontSize: "16px", justifyContent: "center" } : {}} className="logo">
          Chain{collapsed && <br />}Pips
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <LineChartOutlined />,
              label: "Trade",
            },
            {
              key: "2",
              icon: <HistoryOutlined />,
              label: "History",
            },
            {
              key: "3",
              icon: <InfoCircleOutlined />,
              label: "About",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <span style={{display: "inline-flex", marginLeft: "auto", paddingRight: "1rem"}}>
            <ConnectButton />
          </span>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
          }}
        >
          <div style={{ height: "100%", overflow: "scroll" }}>
            <div id="tradingview_31607"></div>
            <Chart
              symbol="FX:EURUSD"
              container_id="tradingview_31607"
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
