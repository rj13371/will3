import React, { useEffect, useState, useContext, Fragment, useRef } from "react";
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
  const componentMounted = useRef(true);

  // useEffect(() => {
  //   (async () => {
  //     const options = { chain: chainId, address: `${userAddress}` };
  //     const balances = await Moralis.Web3API.account.getTokenBalances(options);
  //     const nativeBalance = await Moralis.Web3API.account.getNativeBalance(options);
  //     console.log(balances, userAddress);

  //     setTokens(balances);
  //     updateTokenList(balances);
  //     setnativeBalance(nativeBalance);
  //   })();
  // }, [userAddress, chainId]);

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
    setFinishedLoading(true);

    let tokens;

    await (async () => {
      const options = { chain: chainId, address: `${userAddress}` };
      const balances = await Moralis.Web3API.account.getTokenBalances(options);
      const nativeBalance = await Moralis.Web3API.account.getNativeBalance(options);
      console.log(balances, userAddress);
      tokens = balances;
      setTokens(balances);
      updateTokenList(balances);
      setnativeBalance(nativeBalance);
    })();

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
            console.log(token);
          } catch (e) {
            console.log(e);
          }
        };
        console.log("checked", finishedLoading);
        checkWill3TokenAllowance();
      }
    };
    await checkAllAllowances();

    if (componentMounted.current) {
      setFinishedLoading(false);
    }
    return () => {
      console.log("checked", finishedLoading);
      componentMounted.current = false; // (4) set it to false when we leave the page
    };
  }, [userAddress, chainId, signer, provider]);

  return (
    <Fragment>
      {finishedLoading && chainId && userAddress && signer && provider && address ? (
        <Spin indicator={antIcon} />
      ) : (
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
                  {token.isApproved ? (
                    <Tooltip placement="top" title="Approved">
                      ✅
                    </Tooltip>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => {
                        ApproveToken(signer, provider, address, token);
                      }}
                    >
                      Approve Token
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Fragment>
  );
}
