pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {
    event CreateWill3(address sender);
    uint256 public will3CreationCost = 700000; // normally 50000000000000000

    struct dispersement {
        address assetAddress;
        uint256 percentageOfHoldings;
        address receivingAddress;
    }

    struct Will3 {
        address assetAddress;
        uint256 percentageOfHoldings;
        address receivingAddress;
    }

    mapping(address => Will3[]) public allWill3;

    constructor() {
        // what should we do on deploy?
        console.log("do a dance");
    }

    function setWill3CreationCost(uint256 newCreationCost) public {
        will3CreationCost = newCreationCost;
        console.log(msg.sender, "set generation cost to", newCreationCost);
    }

    function getWill3(address will3Address)
        public
        view
        returns (Will3[] memory myWill3)
    {
        uint256 length = allWill3[will3Address].length;
        console.log("length");
        console.log(length);

        return allWill3[will3Address];
    }

    function createWill3(
        address[] memory assetAddress,
        uint256[] memory percentageOfHoldings,
        address[] memory receivingAddress
    ) public payable {
        require(msg.value >= will3CreationCost, "INCORRECT ETHER AMOUNT SENT");
        uint256 will3Length = receivingAddress.length;
        require(
            will3Length == percentageOfHoldings.length &&
                will3Length == assetAddress.length,
            "UNEQUAL AMOUNT OF WILL3 DISPERSEMENTS SENT"
        );

        console.log("trying to create a will3");

        Will3[] memory newWill3Array = new Will3[](will3Length);

        console.log("new Will3 length");
        console.log(newWill3Array.length);

        console.log("Current Will3 length");
        console.log(allWill3[msg.sender].length);

        uint256 currentWill3Length = allWill3[msg.sender].length;
        for (uint256 i = 0; i < currentWill3Length; i += 1) {
            allWill3[msg.sender].pop();
        }
        console.log(msg.sender, "removed old Will3");
        console.log("Current Will3 length");
        console.log(allWill3[msg.sender].length);

        // uint256 length = allWill3[msg.sender].length;
        for (uint256 j = 0; j < will3Length; j += 1) {
            allWill3[msg.sender].push(
                Will3(
                    assetAddress[j],
                    percentageOfHoldings[j],
                    receivingAddress[j]
                )
            );
        }
        console.log(msg.sender, "created a new will3");
        emit CreateWill3(msg.sender);
    }
}
