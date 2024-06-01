import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import contractArtifacts from '../artifacts/contracts/LibraToken.sol/LibraToken.json';
import "./LibraTokenFront.css";
import {getToken} from '../useToken.js';

const secondsInDay = 86400;

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', { chainId: 1337 });
const abi = contractArtifacts.abi;

function MintButton(props) {

  const handleMint = async () => {

    // TODO: checking props to be correct
    try {
      const contractAddress = props.contractAddress;
      const owner = provider.getSigner(props.ownerAddress);
      const contract = new ethers.Contract(contractAddress, abi, owner);

      // Debugging: Log the signer address
      const ownerAddress = await owner.getAddress();
      console.log('owner address:', ownerAddress);

      const ids = [props.id]; // Single tokenId

      const tx = await contract.connect(owner).serialMint(props.receiverAddress, ids, props.metadata);
      await tx.wait();
      console.log('Minting successful! ');
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  return (
    <button onClick={handleMint}>Mint token {props.id}</button>
  );
}

function PriceButton(props) {
  const [price, setPrice] = useState(0);

  const handlePrice = async () => {
    // TODO: checking props to be correct
    try {
      const contractAddress = props.contractAddress;
      const owner = provider.getSigner(props.ownerAddress);
      const contract = new ethers.Contract(contractAddress, abi, owner);

      // Debugging: Log the signer address
      const ownerAddress = await owner.getAddress();
      console.log('owner address:', ownerAddress);

      const returnedPrice = await contract.price(props.id, Math.floor(Date.now() / 1000));
      console.log('Got price successfully! ');

      setPrice(ethers.utils.formatUnits(returnedPrice, 18));
    } catch (error) {
      console.error('Didn\'t get price:', error);
    }
  };

  return (
    <>
    <button onClick={handlePrice}>Price of token {props.id}</button>
    {price !== null && (
        <div>Token {props.id} price is {price}</div>
    )}
    </>
  );
}

function ApproveButton(props) {
  const spenderAddress = "0x95bD8D42f30351685e96C62EDdc0d0613bf9a87A";

  const handleApprove = async () => {

    // TODO: checking props to be correct
    try {
      const contractAddress = props.contractAddress;
      console.log('ownerAddress:', props.ownerAddress);
      const owner = provider.getSigner(props.ownerAddress);
      const contract = new ethers.Contract(contractAddress, abi, owner);

      const tx = await contract.connect(owner).setApprovalForAll(spenderAddress, 1);
      await tx.wait();
      console.log('Approval success!');
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  return (
    <button onClick={handleApprove}>Approve</button>
  );
}

export default function LaunchToken(props) {
  // Mint tokens values
  const [id, setID] = useState(0);
  const [metadata, setMetadata] = useState({
    ipoSerial: 0,
    ipoPrice: 0,
    ipoTimestamp: Math.floor(Date.now() / 1000),
    dailyInterestRate: ethers.utils.parseUnits("0", 9),
    burnTimestamp: Math.floor(Date.now() / 1000) + (1 * secondsInDay),
  });
  const [receiverAddress, setReceiverAddress] = useState('');

  const [ownerAddress, setOwnerAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  useEffect(() => {
    const fetchTokenData = async () => {
      const token = await getToken();
      if (token) {
        setContractAddress(token.addressToken);
        setOwnerAddress(token.userAddress);
      }
    };

    fetchTokenData();
  }, []);

  //Token price values
  const [idPrice, setIdPrice] = useState(0);

  //Tokens mint handlers
  const handleIDChange = (event) => {
    setID(event.target.value);
  };

  const handleMetadataChange = (key, value) => {
    setMetadata(prevProps => ({
      ...prevProps,
      [key]: value,
    }));
  }

  const handleReceiverAddressChange = (event) => {
    setReceiverAddress(event.target.value);
  };

  //Token price handlers
  const handleIdPriceChange = (event) => {
    setIdPrice(event.target.value);
  };

  return (
  <div>
    <h1>Tokens</h1>
    <h3>Mint token</h3>

    <h4>Your address: {ownerAddress}</h4>
    <h4>Your token contract address: {contractAddress}</h4>

    <label htmlFor="id">Enter id for mint:</label><br/>
    <input
      type="number"
      id="id"
      value={id}
      onChange={handleIDChange}
    /><br/>

    <label htmlFor="metadata">Enter token properties:</label><br/>
    <label htmlFor="ipoPrice">IPO price:</label>
    <input
      type="number"
      id="ipoPrice"
      onChange={e => handleMetadataChange("ipoPrice", ethers.utils.parseUnits(e.target.value, 18))}
    />

    <label htmlFor="dailyInterestRate">Interest rate:</label>
    <input
      type="number"
      id="dailyInterestRate"
      onChange={e => handleMetadataChange("dailyInterestRate", ethers.utils.parseUnits(e.target.value, 9))}
      step="0.01"
    />

    <label htmlFor="burnTimestamp">Burn date:</label>
    <input
      type="date"
      id="burnTimestamp"
      onChange={e => {
      const selectedDate = new Date(e.target.value);
      handleMetadataChange("burnTimestamp", Math.floor(selectedDate.getTime() / 1000))
      }
      }
    /><br/>

    <label htmlFor="receiverAddress">Receiver address:</label><br/>
    <input
      type="text"
      id="receiverAddress"
      value={receiverAddress}
      onChange={handleReceiverAddressChange}
    /><br/>

    <MintButton
      ownerAddress={ownerAddress}
      id={id}
      metadata={metadata}
      receiverAddress={receiverAddress}
      contractAddress={contractAddress}
    /><br/>

    <h3>Token price</h3>
    <label htmlFor="idPrice">Enter id of token:</label><br/>
    <input
      type="number"
      id="idPrice"
      value={idPrice}
      onChange={handleIdPriceChange}
    />

    <PriceButton
      ownerAddress={ownerAddress}
      id={idPrice}
      contractAddress={contractAddress}
    /><br/>

    <h3>Approve tokens</h3>

    <ApproveButton
      ownerAddress={ownerAddress}
      contractAddress={contractAddress}
    />

  </div>
  );
}