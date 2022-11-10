import React, { useRef } from "react";
import {
  Button,
  Col,
  Form,
  Typography,
  Row,
  Select,
  Spin,
  InputNumber,
} from "antd";
import type { FormInstance } from "antd/es/form";
import { useAppContext } from "$utils/context";
import {
  closeTrade,
  getPositions,
  openBuyTrade,
  openSellTrade,
} from "$utils/actions";
import { useWalletInfo } from "$utils/hooks";
import { useQuery } from "react-query";

const { Option } = Select;

type Props = {};

const TradingSidebar = (props: Props) => {
  type FormFields = {
    "trading-pair": string;
    amount: number;
  };
  const { setCurrentPair } = useAppContext();
  const formRef = useRef<FormInstance<FormFields>>(null);
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const { provider, isConnected } = useWalletInfo();

  const positionsQuery = useQuery("positions", () => getPositions(provider));

  const onChange = (value: string) => {
    setCurrentPair(value);
  };

  return (
    <Form {...layout} ref={formRef} name="control-ref">
      <Form.Item
        initialValue={"EURUSD"}
        name="trading-pair"
        label="Trading Pair"
      >
        <Select
          onChange={onChange}
          placeholder="Select a option and change input text above"
        >
          <Option value="EURUSD">EURUSD</Option>
          <Option value="GBPUSD">GBPUSD</Option>
          <Option value="AUDUSD">AUDUSD</Option>
        </Select>
      </Form.Item>
      <Typography.Title style={{ textAlign: "center" }} level={1}>
        0.64121
      </Typography.Title>
      {/* amount */}
      <Form.Item
        name="amount"
        label="Amount ($)"
        rules={[{ required: true, message: "Please input amount!" }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Row gutter={8}>
        <Col span={12}>
          <Button
            type="primary"
            block
            onClick={async () => {
              await formRef.current?.validateFields();
              const values = formRef.current?.getFieldsValue();
              if (!isConnected) return alert("Please connect your wallet");
              if (!values?.amount) return alert("Please enter amount");
              await openBuyTrade(provider, values.amount);
              await positionsQuery.refetch();
            }}
          >
            Buy
          </Button>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            block
            onClick={async () => {
              await formRef.current?.validateFields();
              const values = formRef.current?.getFieldsValue();
              if (!isConnected) return alert("Please connect your wallet");
              if (!values?.amount) return alert("Please enter amount");
              await openSellTrade(provider, values.amount);
              await positionsQuery.refetch();
            }}
            danger
          >
            Sell
          </Button>
        </Col>
      </Row>
      <Typography.Title style={{ padding: "2rem 0 0" }} level={5}>
        Open Positions
      </Typography.Title>
      {positionsQuery.isLoading && <Spin />}
      {positionsQuery.data
        ?.filter(({ exitTime }) => exitTime === 0)
        .map((position) => (
          <div
            key={position.id}
            style={{ marginBottom: "1rem", position: "relative" }}
          >
            {/* Display pair, amount, entry price and time, exit price amd time */}
            <Typography.Title level={5}>
              {"EURUSD" ?? position.tradingPair},{" "}
              <span
                style={{
                  color: position.tradeType === 0 ? "#1890ff" : "#ff4d4f",
                }}
              >
                {position.tradeType === 0 ? "buy" : "sell"} ${position.amount}
              </span>
            </Typography.Title>
            <div>
              <Typography.Text>
                {position.entryPrice} &#8594; {position.exitPrice}{" "}
              </Typography.Text>
            </div>
            <hr />
            {/* Close */}
            <Button
              onClick={async () => {
                await closeTrade(provider, position.id);
                await positionsQuery.refetch();
              }}
              style={{ position: "absolute", right: "0.5rem", bottom: "50%" }}
            >
              x
            </Button>
          </div>
        ))}
    </Form>
  );
};

export default React.memo(TradingSidebar);
