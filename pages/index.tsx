import type { NextPage } from "next";
import Head from "next/head";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Typography } from "antd";
import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Chart from "$components/Chart";
const { Header, Sider, Content } = Layout;
import { Col, Row } from "antd";
import TradingSidebar from "$components/TradingSidebar";
import { useAppContext } from "$utils/context";
import Moralis from "$utils/moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

const Home: NextPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState("1");
  const { currentPair } = useAppContext();

  (async () => {
    const address = "0xbC5a3400E7F8ebb20851226fb6daf7acE7050904";
    const chain = EvmChain.MUMBAI;
    const response = await Moralis.EvmApi.events.getContractLogs({
      chain,
      address,
    });
    console.log(response);
  })();

  return (
    <Layout className="layout">
      <Head>
        <title>ChainPips</title>
        <meta name="description" content="Permissionless Forex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={
            collapsed ? { fontSize: "16px", justifyContent: "center" } : {}
          }
          className="logo"
        >
          Chain{collapsed && <br />}Pips
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onSelect={(selectInfo) => {
            setCurrentTab(selectInfo.key);
          }}
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
          <span
            style={{
              display: "inline-flex",
              marginLeft: "auto",
              paddingRight: "1rem",
            }}
          >
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
          {currentTab === "1" && (
            <Row gutter={16}>
              <Col span={16}>
                <div style={{ minHeight: "60vh", overflow: "scroll" }}>
                  <div id="tradingview_31607"></div>
                  <Chart
                    symbol={"FX:" + currentPair}
                    container_id="tradingview_31607"
                    autosize
                  />
                </div>
              </Col>
              <Col span={8}>
                <TradingSidebar />
              </Col>
            </Row>
          )}
          {currentTab === "2" && (
            <>
              <Typography.Title level={3}>
                Trade History (All Positions)
              </Typography.Title>
              <div
                style={{ overflow: "scroll", maxHeight: "calc(100% - 3rem)" }}
              >
                <TradingSidebar showAll />
              </div>
            </>
          )}
          {currentTab === "3" && (
            <Row gutter={16}>
              <Col span={16}>
                <Typography.Title level={3}>Abou Chain Pips</Typography.Title>
                <Typography.Paragraph>
                  ChainPips is a permissionless forex trading platform built on
                  Binance Smart Chain. It allows users to trade forex pairs with
                  no counterparty risk. Users can trade with leverage and earn
                  interest on their positions.
                </Typography.Paragraph>
                <Typography.Paragraph>
                  Liquidity is provided by ChainPips' liquidity providers. LPs
                  earn interest on their positions and are incentivized to
                  provide liquidity to the platform.
                </Typography.Paragraph>
              </Col>
            </Row>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
