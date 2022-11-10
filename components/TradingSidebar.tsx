import React, { useRef } from "react";
import { Button, Col, Form, Typography, Row, Select } from "antd";
import type { FormInstance } from "antd/es/form";
import { useAppContext } from "$utils/context";

const { Option } = Select;

type Props = {};

const TradingSidebar = (props: Props) => {
  const { setCurrentPair } = useAppContext();
  const formRef = useRef<FormInstance>(null);
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

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
      <Typography.Title style={{textAlign: "center"}} level={1}>0.64121</Typography.Title>
      <Row gutter={8}>
        <Col span={12}>
            <Button type="primary" block>Buy</Button>
        </Col>
        <Col span={12}>
            <Button type="primary" block danger>Sell</Button>
        </Col>
      </Row>
      <Typography.Title style={{padding: "2rem 0"}} level={5}>Positions</Typography.Title>
    </Form>
  );
};

export default React.memo(TradingSidebar);
