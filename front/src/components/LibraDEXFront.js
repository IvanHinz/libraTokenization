import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import contractArtifacts from '../artifacts/contracts/LibraDEX.sol/LibraTokenDEX.json';
import {getToken} from '../useToken.js';
import './LibraDEXFront.css';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', { chainId: 1337 });
const abi = contractArtifacts.abi;

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
  const [dexAddress, setDexAddress] = useState('');

  useEffect(() => {
    const fetchTokenData = async () => {
      const token = await getToken();
      if (token) {
        setDexAddress(token.addressDex);
      }
    };

    fetchTokenData();
  }, []);

  const handleIDChange = (event) => {
    setID(event.target.value);
  };

  return (
    <div className="dex-wrapper">
      <h1>DEX</h1>
      <h3>Buy</h3>
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
