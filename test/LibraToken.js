const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("LibraToken", function () {
  
      beforeEach(async function () {
          [owner, addr1, addr2] = await ethers.getSigners();
  
          const LibraTokenFactory = await ethers.getContractFactory("LibraToken");
          libraToken = await LibraTokenFactory.deploy();
      });
  
      it("Should have correct name and symbol", async function () {
          expect(await libraToken.name()).to.equal("LibraToken");
          expect(await libraToken.symbol()).to.equal("LBT");
      });
  

      it("Should have correct owner", async function () {
        expect(await libraToken.connect(owner).owner()).to.equal(owner);
      });

      it("Should correctly mint token (s) to an address", async function () {
        // current timestamp
        const currentTimestamp = Date.now();
        console.log(currentTimestamp);

        // Calculate the number of milliseconds in 5 days
        const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000;

        // Add 5 days to the current timestamp
        const futureTimestamp = currentTimestamp + fiveDaysInMillis;
        
        await libraToken.connect(owner).serialMint(addr2.address, [0], [0, 1000, currentTimestamp, 7, futureTimestamp]);

        // current timestamp
        const newcurrentTimestamp = Date.now();
        console.log(newcurrentTimestamp);

        const currentLibraTokenPrice = await libraToken.connect(owner).price(0, newcurrentTimestamp);
        console.log(currentLibraTokenPrice);
      });
  });
  