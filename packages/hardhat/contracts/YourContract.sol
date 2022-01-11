pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YourContract is Ownable {
    event CreateWill3(address sender);
    uint256 public will3CreationCost = 700000; // normally 50000000000000000

    struct Will3 {
        address assetAddress;
        uint256 percentageOfHoldings;
        address receivingAddress;
    }

    mapping(address => Will3[]) public addressToWill3;
    mapping(address => uint256) public addressToDisburseBlock;
    uint256 BLOCK_INCREASE = 3100000;

    constructor() {
        // what should we do on deploy?
        console.log("do a dance");
    }

    function setWill3CreationCost(uint256 newCreationCost) public onlyOwner {
        will3CreationCost = newCreationCost;
        console.log(msg.sender, "set generation cost to", newCreationCost);
    }

    function getWill3(address will3Address)
        public
        view
        returns (Will3[] memory myWill3)
    {
        uint256 length = addressToWill3[will3Address].length;
        console.log("length");
        console.log(length);

        return addressToWill3[will3Address];
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
        uint256 currentWill3Length = addressToWill3[msg.sender].length;
        for (uint256 i = 0; i < currentWill3Length; i += 1) {
            addressToWill3[msg.sender].pop();
        }

        for (uint256 j = 0; j < will3Length; j += 1) {
            addressToWill3[msg.sender].push(
                Will3(
                    assetAddress[j],
                    percentageOfHoldings[j],
                    receivingAddress[j]
                )
            );
        }
        addressToDisburseBlock[msg.sender] = block.number + BLOCK_INCREASE;
        console.log(msg.sender, "created a new will3");
        emit CreateWill3(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setBlockIncrease(uint256 newBlockIncrease) public onlyOwner {
        BLOCK_INCREASE = newBlockIncrease;
    }

    function sendDisbursements(address deceasedAddress) public {
        // require(msg.sender == msg.sender, "INVALID SENDER");
        Will3[] memory wills = addressToWill3[deceasedAddress];
        // mapping(address => uint256) memory assetAddressToOriginalAmount;
        // console.log()
        for (uint i=0; i<wills.length; i++) {
            console.log(wills[i].assetAddress);
            console.log(wills[i].percentageOfHoldings);
            console.log(wills[i].receivingAddress);
        }
        console.log("length of wills");
        console.log(wills.length);
        // return address(this).balance;
    }

    function withdraw() external onlyOwner {
        (bool sent, ) = owner().call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}
