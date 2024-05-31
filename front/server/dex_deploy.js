const { ethers } = require("ethers");

async function main() {
  const DEX_contractArtifact = require("./front/src/artifacts/contracts/LibraDEX.sol/LibraTokenDEX.json");
  const Currency_contractArtifact = require("./front/src/artifacts/contracts/LibraCurrency.sol/LibraTokenCurrency.json");
  const Asset_contractArtifact = require("./front/src/artifacts/contracts/LibraToken.sol/LibraToken.json");

  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545", { chainId: 1337 });

  const signerCurrency = provider.getSigner(0);
  const LibraTokenCurrency = new ethers.ContractFactory(Currency_contractArtifact.abi, Currency_contractArtifact.bytecode, signerCurrency);
  const libraTokenCurrency = await LibraTokenCurrency.deploy();
  await libraTokenCurrency.deployed();
  console.log("Currency owner:", await provider.getSigner(0).getAddress());
  console.log("LibraTokenCurrency deployed to:", libraTokenCurrency.address);

  const signerAsset = provider.getSigner(4);
  const LibraTokenAsset = new ethers.ContractFactory(Asset_contractArtifact.abi, Asset_contractArtifact.bytecode, signerAsset);
  const libraTokenAsset = await LibraTokenAsset.deploy();
  await libraTokenAsset.deployed();
  console.log("Token owner:", await provider.getSigner(4).getAddress());
  console.log("LibraTokenAsset deployed to:", libraTokenAsset.address);

  const signerDEX = provider.getSigner(8);
  const LibraTokenDEX = new ethers.ContractFactory(DEX_contractArtifact.abi, DEX_contractArtifact.bytecode, signerDEX);
  const libraTokenDEX = await LibraTokenDEX.deploy(libraTokenCurrency.address, libraTokenAsset.address);
  await libraTokenDEX.deployed();
  console.log("Dex owner:", await provider.getSigner(8).getAddress());
  console.log("LibraTokenDEX deployed to:", libraTokenDEX.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });