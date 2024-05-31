import { ethers } from 'ethers';
import React, { useState } from 'react';
import contractArtifacts from '../artifacts/contracts/LibraToken.sol/LibraToken.json';
import "./LibraTokenFront.css"

const secondsInDay = 86400;

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', { chainId: 1337 });

const OwnerToContract = {
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65": "0xbdEd0D2bf404bdcBa897a74E6657f1f12e5C6fb6",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc": "0x9bAaB117304f7D6517048e371025dB8f89a8DbE5",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9": "0x82B769500E34362a76DF81150e12C746093D954F",
  "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955": "0xef11D1c2aA48826D4c41e54ab82D1Ff5Ad8A64Ca"
};

const abi = contractArtifacts.abi;

function MintButton(props) {

  const handleMint = async () => {

    // TODO: checking props to be correct
    try {
      const contractAddress = OwnerToContract[props.ownerAddress];
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
      const contractAddress = OwnerToContract[props.ownerAddress];
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
      const contractAddress = OwnerToContract[props.ownerAddress];
      console.log('ownerAddress:', props.ownerAddress);
      console.log('signerAddress:', provider.getSigner(props.ownerAddress));
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
  const [ownerAddress, setOwnerAddress] = useState('0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65');

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

  const handleOwnerAddressChange = (event) => {
    setOwnerAddress(event.target.value);
  }

  //Token price handlers
  const handleIdPriceChange = (event) => {
    setIdPrice(event.target.value);
  };

  return (
  <div>
    <h1>Tokens</h1>
    <h3>Mint token</h3>
    <label htmlFor="ownerAddress">Choose address to mint from:</label><br/>
    <select name="ownerAddress" onChange={handleOwnerAddressChange}>
      <option value="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65">0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65</option>
      <option value="0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc">0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc</option>
      <option value="0x976EA74026E726554dB657fA54763abd0C3a0aa9">0x976EA74026E726554dB657fA54763abd0C3a0aa9</option>
      <option value="0x14dC79964da2C08b23698B3D3cc7Ca32193d9955">0x14dC79964da2C08b23698B3D3cc7Ca32193d9955</option>
    </select><br/>

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

    <MintButton ownerAddress={ownerAddress} id={id} metadata={metadata} receiverAddress={receiverAddress} /><br/>

    <h3>Token price</h3>
    <label htmlFor="idPrice">Enter id of token:</label><br/>
    <input
      type="number"
      id="idPrice"
      value={idPrice}
      onChange={handleIdPriceChange}
    />

    <PriceButton ownerAddress={ownerAddress} id={idPrice} /><br/>

    <h3>Approve tokens</h3>

    <ApproveButton ownerAddress={ownerAddress}/>

  </div>
  );
}