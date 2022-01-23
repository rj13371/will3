import React, { useContext, useState } from "react";
import { ethers } from "ethers";
import { notification } from "antd";

export default function ApproveToken(signer, provider, address, token) {
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

  const updateWill3TokenAllowance = async () => {
    try {
      const tempContract = new ethers.Contract(token.token_address, erc20Abi, signer);
      const result = await makeCall("approve", tempContract, [
        address,
        ethers.utils.hexlify(ethers.utils.parseUnits("1000000000", token.decimals)),
      ]);
      console.log(result);
      notification.info({
        className: "frontendModal",
        message: "Transaction sent!",
        description: (
          <p>
            {"See your transaction "}
            <a href={`https://snowtrace.io/tx/${result.hash}`}>{"here on AVAX explorer"}</a>
          </p>
        ),
        placement: "topLeft",
        duration: 4,
      });
      return true;
    } catch (e) {
      console.log(e);
    }
  };

  updateWill3TokenAllowance();
  return null;
}
