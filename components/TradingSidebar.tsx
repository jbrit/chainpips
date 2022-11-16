import React, { useEffect, useRef, useState } from "react";
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
  getPairPrice,
  getPositions,
  openBuyTrade,
  openSellTrade,
} from "$utils/actions";
import { useWalletInfo } from "$utils/hooks";
import { useQuery } from "react-query";

const { Option } = Select;

type Props = {
  showAll?: boolean;
  balance: string;
};
const FACTOR = 0.00374290882;

const TradingSidebar = ({ showAll, balance }: Props) => {
  type FormFields = {
    "trading-pair": string;
    amount: number;
  };
  const { setCurrentPair, currentPair } = useAppContext();
  const formRef = useRef<FormInstance<FormFields>>(null);
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const [buying, setBuying] = useState(false);
  const [selling, setSelling] = useState(false);

  const { provider, isConnected } = useWalletInfo();

  const positionsQuery = useQuery("positions", () => getPositions(provider), {
    refetchInterval: 1000,
  });

  const pairPriceQuery = useQuery("pairPrice", () => getPairPrice(provider), {
    refetchInterval: 1000,
  });

  const onChange = (value: string) => {
    setCurrentPair(value);
  };
  const price =
    currentPair === "EURUSD"
      ? pairPriceQuery.data
        ? (pairPriceQuery.data * FACTOR) / 1e8
        : "--"
      : null;

  return (
    <Form {...layout} ref={formRef} name="control-ref">
      USDP Balance: {balance}
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
        {typeof price === "number" ? price.toFixed(5) : price}
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
            loading={buying}
            disabled={currentPair !== "EURUSD" || !isConnected}
            onClick={async () => {
              setBuying(true);
              try {
                await formRef.current?.validateFields();
                const values = formRef.current?.getFieldsValue();
                if (!isConnected) return alert("Please connect your wallet");
                if (!values?.amount) return alert("Please enter amount");
                await openBuyTrade(provider, values.amount);
                await positionsQuery.refetch();
              } catch (error) {
              } finally {
                setBuying(false);
              }
            }}
          >
            Buy
          </Button>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            block
            loading={selling}
            disabled={currentPair !== "EURUSD" || !isConnected}
            onClick={async () => {
              setSelling(true);
              try {
                await formRef.current?.validateFields();
                const values = formRef.current?.getFieldsValue();
                if (!isConnected) return alert("Please connect your wallet");
                if (!values?.amount) return alert("Please enter amount");
                await openSellTrade(provider, values.amount);
                await positionsQuery.refetch();
              } catch (error) {
              } finally {
                setSelling(false);
              }
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
        ?.filter(({ exitTime }) => showAll ?? exitTime === 0)
        .map((position) => (
          <PositionCard
            key={position.id}
            {...{ position, provider, positionsQuery, price }}
          />
        ))}
    </Form>
  );
};

type PositionProps = {
  position: any;
  provider: any;
  positionsQuery: any;
  price: any;
};
const PositionCard: React.FC<PositionProps> = ({
  position,
  provider,
  positionsQuery,
  price,
}) => {
  const [loading, setLoading] = useState(false);
  const entryPrice = (position.entryPrice * FACTOR) / 1e8;
  const exitPrice =
    (position.exitTime === 0 ? price : position.exitPrice / 1e8) * FACTOR;
  const pnl =
    (exitPrice - entryPrice) *
    position.amount *
    (position.tradeType === 0 ? 1 : -1);
  return (
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
          {position.tradeType === 0 ? "buy" : "sell"} ${position.amount} (
          {pnl.toFixed(2)})
        </span>
      </Typography.Title>
      <div>
        <Typography.Text>
          {entryPrice} &#8594; {exitPrice}
        </Typography.Text>
      </div>
      <hr />
      {/* Close */}
      {position.exitTime === 0 && (
        <Button
          loading={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await closeTrade(provider, position.id);
              await positionsQuery.refetch();
            } catch (error) {}
            setLoading(false);
          }}
          style={{ position: "absolute", right: "0.5rem", bottom: "50%" }}
        >
          x
        </Button>
      )}
    </div>
  );
};

export default React.memo(TradingSidebar);
