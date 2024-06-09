import { ethers } from 'ethers';
import React, { useState } from 'react';
import contractArtifacts from '../artifacts/contracts/LibraDEX.sol/LibraTokenDEX.json';
import {getToken} from '../useToken.js';
import './LibraDEXFront.css';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', { chainId: 1337 });
const abi = contractArtifacts.abi;

async function deployContract(credentials) {
 return fetch('http://localhost:3001/dex', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

function DeployButton({tokenAddress}) {
  const [dexAddress, setDexAddress] = useState('');

  const handleDeploy = async e => {
    const userAddress = getToken().userAddress;
    e.preventDefault();
    setDexAddress((await deployContract({
      userAddress,
      tokenAddress
    })).addressDex);
    console.log(dexAddress);
  }

  return (
    <>
    <button onClick={handleDeploy}>Deploy</button>
    {dexAddress !== '' && (
        <div>Dex contract address: {dexAddress}</div>
    )}
    </>
  );
}

function BuyButton(props) {
   const handleBuy = async () => {
    try {
      const dexAddress = props.dexAddress;
      const signer = provider.getSigner(getToken().userAddress);
      console.log("Dex address", dexAddress);
      console.log("Dex signer:", await signer.getAddress());
      const dexContract = new ethers.Contract(dexAddress, abi, signer);
      const currentTimestamp = Math.floor(Date.now() / 1000);
//      //
//      const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
//      const contract = new ethers.Contract(contractAddress, testabi, signer);
//      const allowance = await contract.allowance(await signer.getAddress(), dexAddress);
//      console.log('Total approved:', ethers.utils.formatUnits(allowance, 18));
//      //
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
  const [tokenAddress, setTokenAddress] = useState('');
  const [dexAddress, setDexAddress] = useState('');

  const handleIDChange = (event) => {
    setID(event.target.value);
  };

  const handleTokenAddressChange = (event) => {
    setTokenAddress(event.target.value);
  };

  const handleDexAddressChange = (event) => {
    setDexAddress(event.target.value);
  };

  return (
    <div className="dex-wrapper">
      <h1>DEX</h1>
      <h3>Deploy contract to buy token</h3>
      <label htmlFor="deploy">Enter token address:</label><br/>
      <input
        type="text"
        id="tokenAddress"
        value={tokenAddress}
        onChange={handleTokenAddressChange}
      /><br/>

      <DeployButton tokenAddress={tokenAddress}/>

      <h3>Buy</h3>
      <label htmlFor="dexAddress">Dex contract address:</label><br/>
      <input
        type="text"
        id="dexAddress"
        value={dexAddress}
        onChange={handleDexAddressChange}
      /><br/>
      <label htmlFor="id">Enter id:</label><br/>
      <input
        type="number"
        id="id"
        value={id}
        onChange={handleIDChange}
      /><br/>

      <BuyButton dexAddress={dexAddress} id={id}/>
    </div>
  );
}
