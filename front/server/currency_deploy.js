const { ethers } = require("ethers");

async function main() {
  const contractArtifact = require("../src/artifacts/contracts/LibraCurrency.sol/LibraTokenCurrency.json");
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545", { chainId: 1337 });

  const signer = provider.getSigner(process.env.signerAddress);

  const factory = new ethers.ContractFactory(contractArtifact.abi, contractArtifact.bytecode, signer);
  const contract = await factory.deploy();

  await contract.deployed();
  console.log(contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

