import React, { Fragment, useState } from "react";
import { Tooltip, Button, Spin, Form, Input, Row, Col, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons/lib/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "antd";
import useWindowSize from "./hooks/useWindowHook";

export default function ReleaseDisbursement(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { writeContracts, localProvider, tx } = props;
  const size = useWindowSize();
  const { Title } = Typography;
  const [willExists, setWillExists] = useState(false);
  const [searchedAddress, setSearchedAddress] = useState("");
  const [block, setBlock] = useState(0);

  const onFinish = values => {
    console.log("Success:", values);
    const deceasedAddress = values.deceasedAddress;
    const increaseDisbursementBlock = async () => {
      tx(writeContracts.Will3Master.sendDisbursements(deceasedAddress), update => {
        console.log("📡 Transaction Update:", update);

        if (update && update.data.code === 3) {
          notification.destroy();

          notification.info({
            className: "frontendModal",
            message: "Will 3 Release Fail",
            description: `Disbursement Block has not passed`,
            placement: "topLeft",
            duration: 4,
            icon: <Spin indicator={antIcon} />,
          });
        }

        if (update && (update.status === "confirmed" || update.status === 1)) {
          notification.info({
            className: "frontendModal",
            message: "Will 3 Release Success!",
            description: "Funds have been sent to beneficiaries",
            placement: "topLeft",
            duration: 4,
            icon: <Spin indicator={antIcon} />,
          });
        }
      });
    };
    increaseDisbursementBlock();
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  const onChange = values => {
    const checkAddress = values.target.value;
    setSearchedAddress(checkAddress);
    const getWill3 = async () => {
      if (!writeContracts.Will3Master) {
        return setWillExists(false);
      }
      const result = await writeContracts.Will3Master.getWill3(checkAddress);
      const disbursementBlock = await writeContracts.Will3Master.addressToDisburseBlock(checkAddress);

      if (result.length !== 0) {
        setBlock(disbursementBlock);
        setWillExists(true);
      } else {
        setBlock(0);
        setWillExists(false);
      }
    };

    if (values.target.value.length === 42) {
      getWill3();
    }
  };

  return (
    <Fragment>
      <div>
        <h1>Manually Disburse Will3</h1>
      </div>
      <Form name="sign" onChange={onChange} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
        <Row justify="center">
          <Col span={16}>
            <Title level={5}>
              Will3’s are automatically disbursed using Chainlink Keepers, a third-party service. In the event that
              Keepers fails to function for whatever reason, we have provided a manual process for disbursing Will3’s
              that should have been disbursed automatically. If a Will3’s disbursal block has passed, any user can send
              a transaction to disburse the Will3 owner’s wallet to the designated beneficiaries in their Will3. <br />
              <br />
              {"This will work ONLY if the disbursal block for that Will3 has passed."}
            </Title>
          </Col>
        </Row>

        <Row justify="center">
          <Col span={6}>
            <Form.Item
              style={size.width < 700 ? { width: "120px", right: "80px" } : { padding: "20px", width: "460px" }}
              name="deceasedAddress"
              rules={[
                { required: true },
                { type: "string", min: 42, max: 42, message: "Please input a valid wallet address!" },
              ]}
            >
              <Input placeholder="Address of deceased person" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={12}>
            {willExists ? (
              <div
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  padding: "30px 0px",
                  margin: "20px auto 40px",
                  width: "70%",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <h6 style={{ marginBottom: 4 }}>
                  {searchedAddress}
                  <br />
                  {block ? `Current Block: ${localProvider._lastBlockNumber} Disbursal Block: ${block}` : ``} <br />
                  {block < localProvider._lastBlockNumber
                    ? `This Will3’s disbursal block has passed`
                    : `This Will3’s disbursal block has not yet passed`}
                </h6>

                <Form.Item>
                  <Button style={{ margin: "5px" }} shape="round" size="medium" htmlType="submit">
                    Disburse Will3
                    <Tooltip
                      placement="left"
                      title="The funds on the deceased person's wallet will be disbursed to their beneficiaries if it has passed the Will's execution block"
                    >
                      <InfoCircleOutlined
                        style={{
                          marginLeft: "10px",
                          verticalAlign: "0.125em",
                          fontSize: "16px",
                        }}
                      />
                    </Tooltip>
                  </Button>
                </Form.Item>
              </div>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
}
