import React, { useContext, useEffect, useState, useRef } from "react";
import { Form, Input, Button, Space, Select, InputNumber, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { TokenAddressListContext } from "../../context/TokenAddressList";
import Moralis from "moralis";

export default function DisbursementInput({ tx, writeContracts, userAddress }) {
  const { tokenList } = useContext(TokenAddressListContext);

  const [disbursementFormTokenAddresses, setDisbursementFormTokenAddresses] = useState([]);

  const [disbursementFormBeneficiaryAddresses, setDisbursementFormBeneficiaryAddresses] = useState([]);

  const [disbursementFormPercentages, setDisbursementFormPercentages] = useState([]);

  const emailRef = useRef(null);

  const onFinish = values => {
    if (values.email) {
      emailRef.current = [values.email];
    } else {
      emailRef.current = null;
    }

    let token_address = [];
    let beneficiary_address = [];
    let percentages = [];

    console.log(values);

    for (const disbursements of values.disbursements) {
      token_address.push(disbursements.token_address);
      beneficiary_address.push(disbursements.beneficiary_address);
      percentages.push(disbursements.percentage);
    }

    setDisbursementFormTokenAddresses([...token_address]);

    setDisbursementFormBeneficiaryAddresses([...beneficiary_address]);

    setDisbursementFormPercentages([...percentages]);
  };

  const createWill = async () => {
    tx(
      writeContracts.YourContract.createWill3(
        [...disbursementFormTokenAddresses],
        [...disbursementFormPercentages],
        [...disbursementFormBeneficiaryAddresses],
        { value: 700000 },
      ),
      update => {
        console.log("📡 Transaction Update:", update, emailRef.current);
        if (update && (update.status === "confirmed" || update.status === 1) && emailRef.current !== null) {
          console.log("Run Moralis Cloud Function");

          const sendEmail = async () => {
            console.log("Sending Email...");
            try {
              await Moralis.Cloud.run("emailSubscribe", {
                email: emailRef.current,
                address: userAddress,
                txHash: update.hash,
              });
            } catch (e) {
              console.log(e);
            }
          };

          sendEmail();
        }
      },
    );
  };

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.List name="disbursements">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ marginBottom: 0 }} align="baseline">
                <Form.Item name={[name, "percentage"]}>
                  <InputNumber
                    defaultValue={0}
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace("%", "")}
                  />
                </Form.Item>
                of the
                <Form.Item name={[name, "token_address"]} style={{ minWidth: "100px" }}>
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
                  name={[name, "beneficiary_address"]}
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
                Add Disbursement
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item label="Email (optional)" name="email" style={{ maxWidth: 300 }}>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            console.log("create will3");
            createWill();
          }}
        >
          Create Will3
        </Button>
      </Form.Item>
    </Form>
  );
}
