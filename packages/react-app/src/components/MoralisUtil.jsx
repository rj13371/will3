import React, { useEffect, useState, useContext, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { TokenAddressListContext } from "../context/TokenAddressList";
import Moralis from "moralis";
import { Table } from "react-bootstrap";
const { ethers } = require("ethers");
import { Button, Spin, Tooltip } from "antd";
import ApproveToken from "./CreateWill3/ApproveToken";

const appId = "p3XGDec1HqyPMbMUdVq4Fga0lnpIP9oILh4veXtX";
const serverUrl = "https://nroyfimbebmn.usemoralis.com:2053/server";

export default function MoralisUtil(props) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  Moralis.start({ serverUrl, appId });

  const { chainId, userAddress, signer, provider, address } = props;

  const { updateTokenList } = useContext(TokenAddressListContext);

  const [tokens, setTokens] = useState([]);
  const [nativeBalance, setnativeBalance] = useState([]);
  const [finishedLoading, setFinishedLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const options = { chain: chainId, address: `${userAddress}` };
      const balances = await Moralis.Web3API.account.getTokenBalances(options);
      const nativeBalance = await Moralis.Web3API.account.getNativeBalance(options);

      setTokens(balances);
      updateTokenList(balances);
      setnativeBalance(nativeBalance);
      setFinishedLoading(true);
    })();
  }, [userAddress, chainId]);

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

  useEffect(() => {
    const checkAllAllowances = async () => {
      for (const token of tokens) {
        const checkWill3TokenAllowance = async () => {
          try {
            const tempContract = new ethers.Contract(token.token_address, erc20Abi, signer);

            const result = await makeCall("allowance", tempContract, [userAddress, address]);

            console.log(result);

            if (result._hex !== "0x00") {
              token.isApproved = true;
            }
            return true;
          } catch (e) {
            console.log(e);
          }
        };
        checkWill3TokenAllowance();
      }
    };
    checkAllAllowances();
  }, [finishedLoading]);

  if (!finishedLoading) {
    return <Spin indicator={antIcon} />;
  }
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Token</th>
          <th>Symbol</th>
          <th>Balance</th>
          <th>Approval</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Avalanche</td>
          <td>AVAX</td>
          <td>{nativeBalance.balance ? Number(ethers.utils.formatEther(nativeBalance.balance)) : ""}</td>
          <td>
            <Tooltip placement="top" title="Approved">
              ✅
            </Tooltip>
          </td>
        </tr>
        {tokens.map((token, index) => (
          <tr key={index}>
            <td>{token.name}</td>
            <td>{token.symbol}</td>
            <td>{ethers.utils.formatEther(token.balance)}</td>
            <td>
              {!token.isApproved ? (
                <Button
                  type="primary"
                  onClick={() => {
                    ApproveToken(signer, provider, address, token);
                  }}
                >
                  Approve Token
                </Button>
              ) : (
                <Tooltip placement="top" title="Approved">
                  ✅
                </Tooltip>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
