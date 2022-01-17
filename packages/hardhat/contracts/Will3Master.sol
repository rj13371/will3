pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Will3Master is Ownable {
    event CreateWill3(address sender);
    event UpdateWill3(address sender);
    event UpdateDisbursementBlock(address sender);

    uint256 public will3CreationCost = 700000;
    uint256 public will3UpdateCost = 700; 

    struct Will3 {
        address assetAddress;
        uint256 percentageOfHoldings;
        address receivingAddress;
    }

    mapping(address => Will3[]) public addressToWill3;
    mapping(address => bool) public addressToWill3Disbursed;
    mapping(address => uint256) public addressToDisburseBlock;
    uint256 BLOCK_INCREASE = 0; // 3100000;
    uint256 MAX_BLOCK_INCREASE = 10000000;


    constructor() {
        // what should we do on deploy?
        console.log("do a dance");
    }

    function setWill3CreationCost(uint256 newCreationCost) public onlyOwner {
        will3CreationCost = newCreationCost;
        console.log(msg.sender, "set generation cost to", newCreationCost);
    }

    function setWill3UpdateCost(uint256 newUpdateCost) public onlyOwner {
        will3UpdateCost = newUpdateCost;
        console.log(msg.sender, "set update cost to", newUpdateCost);
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
        addressToWill3Disbursed[msg.sender] = false;
        console.log(msg.sender, "created a new will3");
        emit CreateWill3(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setBlockIncrease(uint256 newBlockIncrease) public onlyOwner {
        BLOCK_INCREASE = newBlockIncrease;
    }

    function setMaxBlockIncrease(uint256 newMaxBlockIncrease) public onlyOwner {
        MAX_BLOCK_INCREASE = newMaxBlockIncrease;
    }

    function increaseDisbursementBlock(uint256 blockIncrease) public payable {
        require(msg.value >= will3UpdateCost, "INCREASE ETH TO UPDATE DISBURSEMENT BLOCK");
        require(blockIncrease <= MAX_BLOCK_INCREASE, "BLOCK INCREASE EXCEEDS MAX ALLOWED");
        require(blockIncrease > 0, "BLOCK INCREASE MUST BE GREATER THAN ZERO");
        addressToDisburseBlock[msg.sender] += blockIncrease;
        emit UpdateDisbursementBlock(msg.sender);
    }

    function sendDisbursements(address deceasedAddress) public {
        require(addressToDisburseBlock[deceasedAddress] < block.number, "DISBURSEMENT BLOCK HAS NOT PASSED YET");
        require(addressToWill3Disbursed[msg.sender] == false, "DISBURSEMENT HAS ALREADY BEEN EXECUTED");
        Will3[] memory wills = addressToWill3[deceasedAddress];
        for (uint i=0; i<wills.length; i++) {
            ERC20 token = ERC20(wills[i].assetAddress);
            uint256 amountOfToken = token.balanceOf(deceasedAddress);
            // check permissions for contract to be able to send asset on behalf of address
            if (token.allowance(deceasedAddress, address(this)) > 0) {
                // if yes, check if this is the first time coming across this asset, if yes, store the amount of asset in wallet in memory
                // if yes, send the asset to the address
                token.transferFrom(deceasedAddress, wills[i].receivingAddress, uint(amountOfToken) / wills[i].percentageOfHoldings);
            }
        }

        console.log("length of wills");
        console.log(wills.length);
        addressToWill3Disbursed[msg.sender] = true;
    }

    function withdraw() external onlyOwner {
        (bool sent, ) = owner().call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}
