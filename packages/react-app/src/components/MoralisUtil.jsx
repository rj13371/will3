import React, { useEffect, useState, useContext, Fragment, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { TokenAddressListContext } from "../context/TokenAddressList";
import Moralis from "moralis";
import { Table } from "react-bootstrap";
const { ethers } = require("ethers");
import { Button, Spin, Tooltip } from "antd";
import ApproveToken from "./CreateWill3/ApproveToken";
import useWindowSize from "./hooks/useWindowHook";

const appId = "p3XGDec1HqyPMbMUdVq4Fga0lnpIP9oILh4veXtX";
const serverUrl = "https://nroyfimbebmn.usemoralis.com:2053/server";

export default function MoralisUtil(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  Moralis.start({ serverUrl, appId });

  const { chainId, userAddress, signer, provider, address } = props;

  const { updateTokenList } = useContext(TokenAddressListContext);

  const [tokens, setTokens] = useState([]);
  const [nativeBalance, setnativeBalance] = useState(0);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [error, setError] = useState("");
  const componentMounted = useRef(true);
  const size = useWindowSize();

  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
  ];

  const makeCall = async (callName, contract, args, metadata = {}) => {
    if (contract[callName]) {
      let result;
      if (args) {
        result = await contract[callName](...args, metadata);
      } else {
        result = await contract[callName]();
      }
      return result;
    }
    return undefined;
    console.log("no call of that name!");
  };

  useEffect(async () => {
    let tokens;
    let isSubscribed = true;

    console.log(componentMounted.current);

    const fetchMoralis = async () => {
      await (async () => {
        try {
          const options = { chain: chainId, address: `${userAddress}` };
          const balances = await Moralis.Web3API.account.getTokenBalances(options);
          const nativeBalance = await Moralis.Web3API.account.getNativeBalance(options);

          // DEBUG
          // console.log("native balance");
          // console.log(nativeBalance.balance);

          tokens = balances;

          if (isSubscribed) {
            setTokens(balances);
            updateTokenList(balances);
            setnativeBalance(ethers.utils.formatEther(nativeBalance.balance));
          }
        } catch (e) {
          if (e) {
            console.log(e);
            setError(e);
          }
        }
      })();

      const checkAllAllowances = async () => {
        if (tokens) {
          tokens.forEach(async token => {
            const checkWill3TokenAllowance = async () => {
              try {
                const tempContract = new ethers.Contract(token.token_address, erc20Abi, signer);

                const result = await makeCall("allowance", tempContract, [userAddress, address]);

                console.log(token);

                if (result._hex !== "0x00") {
                  token.isApproved = true;
                } else {
                  token.isApproved = false;
                }
                console.log(token);
              } catch (e) {
                console.log(e);
              }
            };
            await checkWill3TokenAllowance();
          });
        }
      };

      await checkAllAllowances();
      setFinishedLoading(true);
    };

    await fetchMoralis().catch(console.error);

    return () => (isSubscribed = false);
  }, [userAddress]);

  if (error.length) {
    <Fragment>
      <Spin indicator={antIcon} />
    </Fragment>;
  }

  if (!finishedLoading) {
    return (
      <Fragment>
        <Spin indicator={antIcon} />
      </Fragment>
    );
  } else
    return (
      <span>
        {nativeBalance == 0 ? (
          <Fragment>
            <Spin indicator={antIcon} />
          </Fragment>
        ) : (
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Asset</th>
                <th style={{ width: "10%" }}>Symbol</th>
                <th style={{ width: "30%" }}>Balance</th>
                <th style={{ width: "30%" }}>Approval</th>
              </tr>
            </thead>
            <tbody>
              <Fragment>
                <tr style={{ height: "60px", width: "100%" }}>
                  <td>Avalanche</td>
                  <td>AVAX</td>
                  <td>{Number(nativeBalance).toFixed(4)}</td>
                  <td>
                    <Tooltip
                      placement="top"
                      title="This token is approved for a potential disbursal by Will3 smart contracts"
                    >
                      ✅
                    </Tooltip>
                  </td>
                </tr>
              </Fragment>

              {tokens.map((token, index) => (
                <tr style={{ height: "60px", width: "100%" }} key={index}>
                  <td>{token.name}</td>
                  <td>{token.symbol}</td>
                  <td>{Number(ethers.utils.formatEther(token.balance)).toFixed(4)}</td>
                  <td>
                    {token.isApproved === true ? (
                      <Tooltip
                        placement="top"
                        title="This token is approved for a potential disbursal by Will3 smart contracts"
                      >
                        ✅
                      </Tooltip>
                    ) : token.isApproved === false ? (
                      <Button
                        shape="round"
                        size="large"
                        onClick={() => {
                          ApproveToken(signer, provider, address, token);
                        }}
                      >
                        Approve Token
                      </Button>
                    ) : (
                      <Fragment>
                        <Spin indicator={antIcon} />
                      </Fragment>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </span>
    );
}
