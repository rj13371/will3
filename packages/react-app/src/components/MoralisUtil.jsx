import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import { NETWORK, NETWORKS } from "../constants";
import { Table } from "react-bootstrap";
const { ethers } = require("ethers");

const appId = "p3XGDec1HqyPMbMUdVq4Fga0lnpIP9oILh4veXtX";
const serverUrl = "https://nroyfimbebmn.usemoralis.com:2053/server";

export default function MoralisUtil(props) {
  Moralis.start({ serverUrl, appId });

  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    (async () => {
      const options = { chain: `0x4`, address: `${props.userAddress}` };
      const balances = await Moralis.Web3API.account.getTokenBalances(options);

      setTokens(balances);
    })();
  }, [props.userAddress]);

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Token</th>
          <th>Balance</th>
          <th>Symbol</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, index) => (
          <tr key={index}>
            <td>{token.name}</td>
            <td>{ethers.utils.formatEther(token.balance)}</td>
            <td>{token.symbol}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
