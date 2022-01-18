const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Will3Master", function () {
  let Will3;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("Will3Master", function () {
    it("Should deploy Will3Master", async function () {
      const Will3Master = await ethers.getContractFactory("Will3Master");
      Will3 = await Will3Master.deploy();
      console.log(Will3);
    });
  });
});
