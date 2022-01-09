import React, { useEffect, useState, useContext } from "react";
import { useMoralis } from "react-moralis";
import { TokenAddressListContext } from "../context/TokenAddressList";
import Moralis from "moralis";
import { Table } from "react-bootstrap";
const { ethers } = require("ethers");
import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";

const appId = "p3XGDec1HqyPMbMUdVq4Fga0lnpIP9oILh4veXtX";
const serverUrl = "https://nroyfimbebmn.usemoralis.com:2053/server";

export default function MoralisUtil(props) {
  const { updateTokenList } = useContext(TokenAddressListContext);

  Moralis.start({ serverUrl, appId });

  const [tokens, setTokens] = useState([]);
  const [nativeBalance, setnativeBalance] = useState([]);

  console.log(tokens);

  useEffect(() => {
    (async () => {
      const options = { chain: `0x4`, address: `${props.userAddress}` };
      const balances = await Moralis.Web3API.account.getTokenBalances(options);
      const nativeBalance = await Moralis.Web3API.account.getNativeBalance(options);

      setTokens(balances);
      updateTokenList(balances);
      setnativeBalance(nativeBalance);
    })();
  }, [props.userAddress]);

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Token</th>
          <th>Balance</th>
          <th>Symbol</th>
          <th>Approval</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ethereum</td>
          <td>{nativeBalance.balance ? ethers.utils.formatEther(nativeBalance.balance) : ""}</td>
          <td>ETH</td>
        </tr>
        {tokens.map((token, index) => (
          <tr key={index}>
            <td>{token.name}</td>
            <td>{ethers.utils.formatEther(token.balance)}</td>
            <td>{token.symbol}</td>
            <td>
              <Button
                className="connect-wallet-button"
                onClick={() => {
                  console.log("approved");
                }}
              >
                Approve Token
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
