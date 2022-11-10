import React, { useRef } from "react";
import { Button, Form, Input, Select } from "antd";
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
    </Form>
  );
};

export default React.memo(TradingSidebar);
