const { ethers } = require("ethers");

async function main() {
  const DEX_contractArtifact = require("../src/artifacts/contracts/LibraDEX.sol/LibraTokenDEX.json");

  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545", { chainId: 1337 });

  const addressCurrency = process.env.addressCurrency;
  const addressToken = process.env.addressToken;

  const signerDEX = provider.getSigner(process.env.signerAddress);
  const LibraTokenDEX = new ethers.ContractFactory(DEX_contractArtifact.abi, DEX_contractArtifact.bytecode, signerDEX);
  const libraTokenDEX = await LibraTokenDEX.deploy(addressCurrency, addressToken);
  await libraTokenDEX.deployed();
  console.log(libraTokenDEX.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });