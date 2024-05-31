const { ethers } = require("ethers");

async function main() {
  const contractArtifact = require("./front/src/artifacts/contracts/LibraToken.sol/LibraToken.json");
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545", { chainId: 1337 });

  // Deploy the contract for the accounts 4 - 7
  for (let i = 4; i < 8; i++) {
    const signer = provider.getSigner(i);

    const factory = new ethers.ContractFactory(contractArtifact.abi, contractArtifact.bytecode, signer);
    const contract = await factory.deploy();

    await contract.deployed();

    console.log(`Contract deployed by ${await signer.getAddress()}:`, contract.address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

