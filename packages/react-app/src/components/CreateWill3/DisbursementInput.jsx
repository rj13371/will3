import React, { useContext, useEffect, useState, useRef } from "react";
import { Form, Input, Button, Space, Select, InputNumber, Image, Tooltip } from "antd";
import { MinusCircleOutlined, PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { TokenAddressListContext } from "../../context/TokenAddressList";
import Moralis from "moralis";
import { notification } from "antd";
import { useHistory, Link } from "react-router-dom";

export default function DisbursementInput({ tx, writeContracts, userAddress }) {
  let history = useHistory();

  const UserEmail = Moralis.Object.extend("UserEmail");

  const { tokenList } = useContext(TokenAddressListContext);

  const [disbursementFormTokenAddresses, setDisbursementFormTokenAddresses] = useState([]);

  const [disbursementFormBeneficiaryAddresses, setDisbursementFormBeneficiaryAddresses] = useState([]);

  const [disbursementFormPercentages, setDisbursementFormPercentages] = useState([]);

  const emailRef = useRef(null);
  const didMount = useRef(false);

  async function getEmailFromMoralis() {
    const query = new Moralis.Query(UserEmail);

    query.equalTo("userAddress", userAddress);

    const results = await query.find();
    console.log(results[0]);
    if (results.length == 0) {
      console.log("no email");
    } else {
      const foundUser = results[0];
      const foundEmail = foundUser.get("userEmail");
      console.log(results[0], foundEmail);
      emailRef.current = foundEmail;
    }
  }

  const onFinish = async values => {
    didMount.current = true;

    console.log(values);

    try {
      if (values.email) {
        emailRef.current = values.email;
      } else {
        await getEmailFromMoralis();
      }

      let token_address = [];
      let beneficiary_address = [];
      let percentages = [];

      for (const disbursements of values.disbursements) {
        token_address.push(disbursements.token_address);
        beneficiary_address.push(disbursements.beneficiary_address);
        percentages.push(disbursements.percentage);
      }

      setDisbursementFormTokenAddresses([...token_address]);

      setDisbursementFormPercentages([...percentages]);

      setDisbursementFormBeneficiaryAddresses([...beneficiary_address]);
    } catch (e) {
      //temp error handle
      window.alert(e);
    }
  };

  useEffect(() => {
    const createWill = async () => {
      tx(
        writeContracts.Will3Master.createWill3(
          disbursementFormTokenAddresses,
          disbursementFormPercentages,
          disbursementFormBeneficiaryAddresses,
          { value: 700000 },
        ),
        update => {
          console.log("📡 Transaction Update:", update, emailRef.current, didMount.current);

          let etherscanNetwork = "";
          if (update.network) {
            etherscanNetwork = update.network + ".";
          }

          // let etherscanTxUrl = "https://" + etherscanNetwork + "etherscan.io/tx/";

          if (update && (update.status === "confirmed" || update.status === 1)) {
            const btn = (
              <Button style={{ alignContent: "center" }} type="primary" size="small">
                <a href="/dashboard">Dashboard</a>
              </Button>
            );

            notification.info({
              className: "frontendModal",
              message: "Your Will3 has been created successfully!",
              description: "Redirecting...",
              placement: "topLeft",
              duration: 4,
              btn,
            });

            setTimeout(() => {
              notification.destroy();
              history.push("/dashboard");
            }, 6000);
          }

          if (update && (update.status === "confirmed" || update.status === 1) && emailRef.current !== null) {
            console.log(`Run Moralis Cloud Function with ${emailRef.current}`);

            const sendEmail = async () => {
              try {
                await Moralis.Cloud.run("emailSubscribe", {
                  email: emailRef.current,
                  address: userAddress,
                  txHash: update.hash,
                });

                emailRef.current = null;
              } catch (e) {
                console.log(e);
              }
            };
            sendEmail();
          }
        },
      );
    };

    if (didMount.current) {
      createWill();
      didMount.current = false;
    }
  }, [disbursementFormBeneficiaryAddresses]);

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
                    <Select.Option value={"0x0000000000000000000000000000000000000000"} key={"AVAX"}>
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

      <Form.Item
        tooltip="Enable reminder emails below to get notifications about upcoming Will3 block expirations. Reminder emails are courtesy of the Moralis API."
        label="Email"
        name="email"
        style={{ maxWidth: 300, margin: "auto auto 24px" }}
      >
        <Input type={"email"} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Will3
        </Button>
      </Form.Item>
    </Form>
  );
}
