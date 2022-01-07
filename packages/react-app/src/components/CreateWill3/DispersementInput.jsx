import React, { useState } from "react";
import { Form, Input, Button, Space, Select, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export default function DispersementInput() {
  const onFinish = values => {
    console.log("Received values of form:", values);
  };

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                <Form.Item label="Percentage">
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "first"]}
                  rules={[{ required: true, message: "Missing first name" }]}
                >
                  <Input placeholder="Benefactor Address" />
                </Form.Item>

                <Form.Item label="Select" style={{ minWidth: "200px" }}>
                  <Select>
                    <Select.Option value="demo">ETH</Select.Option>
                    <Select.Option value="demo">AVAX</Select.Option>
                    <Select.Option value="demo">SHITCOIN</Select.Option>
                  </Select>
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Dispersement
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Transaction
        </Button>
      </Form.Item>
    </Form>
  );
}
