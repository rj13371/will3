import React, { Fragment, useState, useEffect, useContext } from "react";
import { Tooltip, Button } from "antd";
import { Table } from "react-bootstrap";
import { InfoCircleOutlined } from "@ant-design/icons/lib/icons";
import Moralis from "moralis";
import { Link } from "react-router-dom";

const appId = "p3XGDec1HqyPMbMUdVq4Fga0lnpIP9oILh4veXtX";
const serverUrl = "https://nroyfimbebmn.usemoralis.com:2053/server";

export default function Dashboard(props) {
  const { writeContracts, address, chainId, mainnetProvider } = props;
  const [will, setWill] = useState([]);
  const [dayTimer, setDayTimer] = useState(0);
  const [block, setBlock] = useState(0);

  useEffect(() => {
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
                setDayTimer(days);
              } else if (res.result === "Error! Block number already pass") {
                setDayTimer(0);
              } else {
                window.alert("an unknown error has occured");
              }
            });
          setBlock(disbursementBlock);
          setWill(wills);
        } else {
        }
      };
      getWill3();
    }
  }, [writeContracts, address, chainId]);

  return (
    <Fragment>
      <div style={{ padding: 16, width: "80%", margin: "auto", marginTop: 24, paddingBottom: 160 }}>
        <div>
          <h1>Your Will3</h1>
        </div>
        {address && will.length > 0 ? (
          <>
            <h6 style={{ textAlign: "left", width: "50%", float: "left" }}>
              {dayTimer ? `Your Will3 is Disburseable in ${dayTimer} Days` : `Your Will was Disbursed on block ${block}`}
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
    </Fragment>
  );
}
