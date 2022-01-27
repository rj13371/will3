import React, { Fragment } from "react";
import { Tooltip, Button, Spin, Form, Input, Row, Col, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons/lib/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "antd";
import useWindowSize from "./hooks/useWindowHook";

export default function ReleaseDisbursement(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { writeContracts, tx } = props;
  const size = useWindowSize();
  const { Title } = Typography;

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

  return (
    <Fragment>
      <div>
        <h1>Release Will 3</h1>
      </div>
      <Form name="sign" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
        <Row justify="center">
          <Col span={6}>
            <Title level={4}>Deceased Address</Title>
          </Col>
        </Row>

        <Row justify="center">
          <Col span={6}>
            <Form.Item
              style={size.width < 700 ? { width: "120px", right: "80px" } : { width: "380px" }}
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
          <Col span={6}>
            <Form.Item>
              <Button shape="round" size="medium" htmlType="submit">
                Release
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
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
}
