import React, { useContext, useState, useRef } from "react";
import { Form, Input, Button, Space, Select, InputNumber, Modal, Divider, Row, Image } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { TokenAddressListContext } from "../../context/TokenAddressList";
import Moralis from "moralis";
import TransactionModal from "../TransactionModal/TransactionModal";

export default function DisbursementInput({ tx, writeContracts, userAddress }) {
  const UserEmail = Moralis.Object.extend("UserEmail");

  const { tokenList } = useContext(TokenAddressListContext);

  const [disbursementFormTokenAddresses, setDisbursementFormTokenAddresses] = useState([]);

  const [disbursementFormBeneficiaryAddresses, setDisbursementFormBeneficiaryAddresses] = useState([]);

  const [disbursementFormPercentages, setDisbursementFormPercentages] = useState([]);

  const firstRender = useRef(true);
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const showSwapModal = () => {
    setSwapModalVisible(true);
  };

  const handleSwapModalClose = () => {
    firstRender.current = true;
    setSwapModalVisible(false);
  };

  const emailRef = useRef(null);

  const TransactionModal = () => {
    return (
      <Modal title={modalTitle} visible={swapModalVisible} onOk={handleSwapModalClose} onCancel={handleSwapModalClose}>
        <Space size={12}>
          <Image
            width={200}
            src={`${process.env.PUBLIC_URL}/scaffold-eth.png`}
            placeholder={<Image preview={false} src={`${process.env.PUBLIC_URL}/scaffold-eth.png`} width={200} />}
          />
        </Space>

        <Divider />
        <Row>{modalDescription}</Row>
      </Modal>
    );
  };

  async function getEmailFromMoralis() {
    const query = new Moralis.Query(UserEmail);
    console.log(userAddress);

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

      setDisbursementFormBeneficiaryAddresses([...beneficiary_address]);

      setDisbursementFormPercentages([...percentages]);
    } catch (e) {
      //temp error handle
      window.alert(e);
    }
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
        if (update && (update.status === "confirmed" || update.status === 1) && firstRender.current) {
          showSwapModal();
          firstRender.current = false;
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
    <>
      <TransactionModal />
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

        <Form.Item label="Subscribe Email (optional)" name="email" style={{ maxWidth: 450 }}>
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
    </>
  );
}
