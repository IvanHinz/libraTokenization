import { ethers } from 'ethers';
import React, { useState } from 'react';
import contractArtifacts from '../artifacts/contracts/LibraDEX.sol/LibraTokenDEX.json';
import testcontractArtifacts from '../artifacts/contracts/LibraCurrency.sol/LibraTokenCurrency.json';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', { chainId: 1337 });
const abi = contractArtifacts.abi;
const testabi = testcontractArtifacts.abi;

function BuyButton(props) {
  const dexAddress = '0x95bD8D42f30351685e96C62EDdc0d0613bf9a87A';

  const handleBuy = async () => {
    try {
      const signer = provider.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
      console.log("Dex signer:", await signer.getAddress());
      const dexContract = new ethers.Contract(dexAddress, abi, signer);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      //
      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      const contract = new ethers.Contract(contractAddress, testabi, signer);
      const allowance = await contract.allowance(await signer.getAddress(), dexAddress);
      console.log('Total approved:', ethers.utils.formatUnits(allowance, 18));
      //
      const tx = await dexContract.connect(signer).buyAsset(props.id, currentTimestamp);
      await tx.wait();
      console.log('Bought successfully! ID:', props.id);
    } catch (error) {
      console.error("Error buying asset:", error);
    }
  };

  return (
    <button onClick={handleBuy}>Buy token {props.id}</button>
  );
}

export default function LaunchDEX() {
  const [id, setID] = useState(0);

  const handleIDChange = (event) => {
    setID(event.target.value);
  };

  return (
    <div>
      <h1>DEX</h1>
      <label htmlFor="id">Enter id:</label><br/>
      <input
        type="number"
        id="id"
        value={id}
        onChange={handleIDChange}
      /><br/>

      <BuyButton id={id}/>
    </div>
  );
}
