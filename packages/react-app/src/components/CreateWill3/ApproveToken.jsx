import React, { useContext, useState } from "react";
import { TokenAddressListContext } from "../../context/TokenAddressList";
import { useContractLoader } from "eth-hooks";

export default function ApproveToken(provider, ourContractAddress, tokenAddress) {
  const contracts = useContractLoader(provider, contractConfig, chainId);
  let contract;
  if (!customContract) {
    contract = contracts ? contracts[name] : "";
  } else {
    contract = customContract;
  }

  const address = contract ? contract.address : "";

  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
  ];

  const { tokenList } = useContext(TokenAddressListContext);

  const signer = selectedProvider.getSigner();

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

  const updateRouterAllowance = async newAllowance => {
    setApproving(true);
    try {
      const tempContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
      const result = await makeCall("approve", tempContract, [ROUTER_ADDRESS, newAllowance]);
      console.log(result);
      setApproving(false);
      return true;
    } catch (e) {
      notification.open({
        message: "Approval unsuccessful",
        description: `Error: ${e.message}`,
      });
    }
  };

  const approveTokenForWill3 = async () => {
    const approvalAmount =
      exact === "in"
        ? ethers.utils.hexlify(ethers.utils.parseUnits(amountIn.toString(), tokens[tokenIn].decimals))
        : amountInMax.raw.toString();
    console.log(approvalAmount);
    const approval = updateRouterAllowance(approvalAmount);
    if (approval) {
      console.log("approved");
    }
  };

  return <div></div>;
}
