const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("LibraTokenCurrency", function () {
    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        const LibraTokenCurrencyFactory = await ethers.getContractFactory("LibraTokenCurrency");
        libraTokenCurrency = await LibraTokenCurrencyFactory.deploy();

        // Wait for the contract to be deployed
        await libraTokenCurrency.waitForDeployment();
    });

    it("Should have correct name and symbol", async function () {
        expect(await libraTokenCurrency.name()).to.equal("LibraTokenCurrency");
        expect(await libraTokenCurrency.symbol()).to.equal("LBTC");
    });

    it("Should correctly mint tokens to specific address", async function () {
        // mint currency
        await libraTokenCurrency.connect(owner).mint(addr1.address, 1000);

        expect(await libraTokenCurrency.balanceOf(addr1.address)).to.equal(1000);
    });

    it("totalSupply function should work correctly", async function () {
      await libraTokenCurrency.connect(owner).mint(addr1.address, 1000);
      expect(await libraTokenCurrency.totalSupply()).to.equal(1000);
    });

    it("Should have correct owner", async function () {
      expect(await libraTokenCurrency.connect(owner).owner()).to.equal(owner);
    });

    it("Should not allow minting from non-owner accounts", async function () {
        // try to mint not from owner's address
        await expect(libraTokenCurrency.connect(addr1).mint(addr2.address, 1000)).to.be.reverted;
    });

    it("Should allow to transfer coins to another account", async function () {
      // mint currency in amount of 1000
      await libraTokenCurrency.connect(owner).mint(addr2.address, 1000);

      // transfer currency in amount of 100 from addr2 to addr1
      await libraTokenCurrency.connect(addr2).transfer(addr1.address, 100);
      
      // test balances
      expect(await libraTokenCurrency.balanceOf(addr2.address)).to.equal(900);
      expect(await libraTokenCurrency.balanceOf(addr1.address)).to.equal(100);
  });
    
});
