const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("LibraDEX_Operations", function () {
  
      beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
  
        const LibraTokenCurrencyFactory = await ethers.getContractFactory("LibraTokenCurrency");
        libraTokenCurrency = await LibraTokenCurrencyFactory.connect(addr1).deploy();

        // Wait for the contract to be deployed
        await libraTokenCurrency.waitForDeployment();

        const LibraTokenFactory = await ethers.getContractFactory("LibraToken");
        libraToken = await LibraTokenFactory.connect(addr2).deploy();

        // Wait for the contract to be deployed
        await libraToken.waitForDeployment();

        const LibraDEXFactory = await ethers.getContractFactory("LibraTokenDEX");
        libraDEX = await LibraDEXFactory.connect(owner).deploy(libraTokenCurrency.target, libraToken.target);

        // Wait for the contract to be deployed
        await libraDEX.waitForDeployment();

        // mint currency
        await libraTokenCurrency.connect(addr1).mint(addr1.address, 3000);

        // current timestamp
        const currentTimestamp = Date.now();

        // Calculate the number of milliseconds in 5 days
        const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000;
        
        // Add 5 days to the current timestamp
        const futureTimestamp = currentTimestamp + fiveDaysInMillis;

        // mint token
        await libraToken.connect(addr2).serialMint(addr2.address, [0], [0, 1000, currentTimestamp, 7, futureTimestamp]);
      });

      it("User is able to buy a token for currency", async function () {
            // approving transfer of cunrrency and token 
            await libraTokenCurrency.connect(addr1).approve(libraDEX.target, 1000);
            await libraToken.connect(addr2).setApprovalForAll(libraDEX.target, 1);

            // current timestamp
            const newcurrentTimestamp = Date.now();

            // call a function buyAsset
            await libraDEX.connect(addr1).buyAsset(0, newcurrentTimestamp);

            // testing that deal went through
            expect(await libraTokenCurrency.balanceOf(addr2.address)).to.equal(1000);
            expect(await libraToken.ownerOf(0)).to.equal(addr1.address);
      });
  });
  