import React, { useContext, useState } from "react";
import { Form, Input, Button, Space, Select, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { TokenAddressListContext } from "../../context/TokenAddressList";

export default function DispersementInput(tokenAddress) {
  const { tokenList } = useContext(TokenAddressListContext);

  const onFinish = values => {
    console.log("Received values of form:", values);
  };

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ marginBottom: 8 }} align="baseline">
                <Form.Item>
                  <InputNumber
                    defaultValue={0}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace("%", "")}
                  />
                </Form.Item>
                of the
                <Form.Item style={{ minWidth: "100px" }}>
                  <Select>
                    {/* change avax value to its address later */}
                    <Select.Option value={"AVAX_ADDRESS"} key={"AVAX"}>
                      {"AVAX"}
                    </Select.Option>

                    {tokenList.map(token => (
                      <Select.Option value={token.token_address} key={token.symbol}>
                        {token.symbol}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                asset will be sent to 
                <Form.Item
                  {...restField}
                  name={[name, "first"]}
                  style={{ minWidth: "300px" }}
                  rules={[{ required: true, message: "Missing address of beneficiary" }]}
                >
                  <Input placeholder="Address of beneficiary" />
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
        <Button type="primary" htmlType="submit" onClick={() => console.log("do trigger function")}>
          Submit Transaction
        </Button>
      </Form.Item>
    </Form>
  );
}
