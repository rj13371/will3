import React, { useContext, useState } from "react";
import { Form, Input, Button, Space, Select, InputNumber, Checkbox } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { TokenAddressListContext } from "../../context/TokenAddressList";
import Moralis from 'moralis'

export default function DispersementInput({ tx, writeContracts, userAddress }) {
  const { tokenList } = useContext(TokenAddressListContext);

  const [disepersementFormTokenAddresses, setDisepersementFormTokenAddresses] = useState([]);

  const [disepersementFormBeneficiaryAddresses, setDisepersementFormBeneficiaryAddresses] = useState([]);

  const [disepersementFormPercentages, setDisepersementFormPercentages] = useState([]);

  const [email, setEmail] = useState();
 

  const onFinish = async values => { 
    let token_address = [];
    let beneficiary_address = [];
    let percentages = [];

    console.log(values)

    for(const dispersements of values.dispersements){
  
      token_address.push(dispersements.token_address)
      beneficiary_address.push(dispersements.beneficiary_address)
      percentages.push(dispersements.percentage)
    }

    setDisepersementFormTokenAddresses([...token_address])

    setDisepersementFormBeneficiaryAddresses([...beneficiary_address])

    setDisepersementFormPercentages([...percentages])

    if(values.emailSubscribe){

      setEmail(values.email)

    }
    

  };

  

  

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <Form.List name="dispersements">
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

<Form.Item
        label="Email"
        name="email"
      >
        <Input />
      </Form.Item>

<Form.Item name="emailSubscribe" valuePropName="checked" >
        <Checkbox>Subscribe your email</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          onClick={ () => {
            console.log("create will3");

            const result = tx(
              writeContracts.YourContract.createWill3( 
                [...disepersementFormTokenAddresses],
                [...disepersementFormPercentages],
                [...disepersementFormBeneficiaryAddresses],
                { value: 700000 },
              ), update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {

                const sentEmail = async () => {

                  await Moralis.Cloud.run("emailSubscribe", {
                    email: email,
                    address: userAddress,
                  });

                }

                sentEmail();

                
              }
            });

          }}



        >
          Create Will3
        </Button>
      </Form.Item>
    </Form>
  );
}
