import React, { Fragment, useState, useEffect, useContext } from "react";
import { Tooltip, Button, Spin, Form, InputNumber, Row, Col } from "antd";
import { Table } from "react-bootstrap";
import { InfoCircleOutlined } from "@ant-design/icons/lib/icons";
import Moralis from "moralis";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { notification } from "antd";

const appId = "p3XGDec1HqyPMbMUdVq4Fga0lnpIP9oILh4veXtX";
const serverUrl = "https://nroyfimbebmn.usemoralis.com:2053/server";

export default function Dashboard(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [loading, setLoading] = useState(false);
  const [increaseFunctionCalled, setIncreaseFunctionCalled] = useState(0);
  const { writeContracts, address, chainId, mainnetProvider, tx } = props;
  const [will, setWill] = useState([]);
  const [dayTimer, setDayTimer] = useState(0);
  const [block, setBlock] = useState(0);

  const onFinish = values => {
    console.log("Success:", values);
    const increaseBlock = values.increaseBlock;
    const increaseDisbursementBlock = async () => {
      tx(writeContracts.Will3Master.increaseDisbursementBlock(increaseBlock, { value: 700000 }), update => {
        console.log("📡 Transaction Update:", update);

        if (update && (update.status === "confirmed" || update.status === 1)) {
          notification.info({
            className: "frontendModal",
            message: "You have resigned your will successfully",
            description: "Reloading Dashboard in 10 seconds",
            placement: "topLeft",
            duration: 8,
            icon: <Spin indicator={antIcon} />,
          });

          setTimeout(() => {
            notification.destroy();
            history.go(0);
          }, 10000);
        }
      });
    };
    increaseDisbursementBlock();
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    setLoading(true);
    if (writeContracts.Will3Master && address) {
      Moralis.start({ serverUrl, appId });

      const getWill3 = async () => {
        const result = await writeContracts.Will3Master.getWill3(address);

        if (result.length !== 0) {
          const wills = [];
          for (const disbursements of result) {
            wills.push({
              assetAddress: disbursements.assetAddress,
              percentageOfHoldings: disbursements.percentageOfHoldings._hex,
              receivingAddress: disbursements.receivingAddress,
            });
          }
          const tokenAddresses = wills.map(disbursement => disbursement.assetAddress);
          const options = { chain: chainId, addresses: tokenAddresses };
          const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata(options);
          for (const will of wills) {
            const result = tokenMetadata.filter(
              token => token.address.toLowerCase() == will.assetAddress.toLowerCase(),
            );
            if (result) {
              will.name = result[0].name;
            }
          }

          const disbursementBlock = await writeContracts.Will3Master.addressToDisburseBlock(address);

          const url = `https://api-testnet.snowtrace.io/api?module=block&action=getblockcountdown&blockno=${disbursementBlock}&apikey=YourApiKeyToken`;

          fetch(url)
            .then(res => res.json())
            .then(res => {
              if (res.status === "1") {
                const seconds = Number(res.result.EstimateTimeInSec);
                const days = Math.floor(seconds / (3600 * 24));
                console.log(days);
                setDayTimer(days);
              } else if (res.result === "Error! Block number already pass") {
                setDayTimer(0);
              } else {
                window.alert("an unknown error has occured");
              }
            });
          setBlock(disbursementBlock);
          setWill(wills);
          setLoading(false);
        } else {
          setLoading(false);
        }
      };
      getWill3();
    }
  }, [address]);

  return (
    <Fragment>
      {loading ? (
        <Spin indicator={antIcon} />
      ) : (
        <div style={{ padding: 16, width: "80%", margin: "auto", marginTop: 24, paddingBottom: 160 }}>
          <div>
            <h1>Your Will3</h1>
          </div>
          {address && will.length > 0 ? (
            <>
              <h6 style={{ textAlign: "left", width: "45%", float: "left" }}>
                {dayTimer
                  ? `Your Will3 is Disburseable in approximately ${dayTimer} Days`
                  : `Your Will was Disbursed on block ${block}`}
                <Tooltip placement="top" title="Time will vary based on the average block transaction speed">
                  <InfoCircleOutlined
                    style={{ marginLeft: "6px", verticalAlign: "0.125em", marginBottom: "12px", fontSize: "16px" }}
                  />
                </Tooltip>
              </h6>

              <h6 style={{ textAlign: "right", width: "50%", float: "right" }}>
                {block ? `Current Block: ${mainnetProvider._lastBlockNumber} | Disbursal Block: ${block}` : ``}
                <Tooltip
                  placement="top"
                  title="Your Will3 will be disburseable after the current block is greater than your disbursal block."
                >
                  <InfoCircleOutlined
                    style={{ marginLeft: "6px", verticalAlign: "0.125em", marginBottom: "12px", fontSize: "16px" }}
                  />
                </Tooltip>
              </h6>

              {will.length > 0 ? (
                <Fragment>
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Percentage</th>
                        <th>Beneficiary Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {will.map((disbursement, key) => (
                        <tr key={`${disbursement.receivingAddress}${key}`}>
                          <td>{disbursement.name}</td>
                          <td>
                            {Number(disbursement.percentageOfHoldings)} {"%"}{" "}
                          </td>
                          <td>{disbursement.receivingAddress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Form name="sign" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                    <Row justify="center">
                      <Col span={3}>
                        <Form.Item name="increaseBlock">
                          <InputNumber defaultValue={0} min={0} max={100000000} />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item>
                          <Button shape="round" size="large" htmlType="submit">
                            Increase block
                          </Button>
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Tooltip
                          placement="top"
                          title="You can increase the block that your disbursements will be sent up to a maximum of 10000000 blocks"
                        >
                          <InfoCircleOutlined
                            style={{
                              marginLeft: "10px",
                              verticalAlign: "0.125em",
                              fontSize: "16px",
                            }}
                          />
                        </Tooltip>
                      </Col>
                    </Row>
                  </Form>
                </Fragment>
              ) : (
                ""
              )}
            </>
          ) : (
            <Button>
              <Link to="/will3">
                <h6 style={{ color: "white", margin: "auto" }}>Create Will</h6>
              </Link>
            </Button>
          )}
        </div>
      )}
    </Fragment>
  );
}
