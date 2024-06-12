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
      props.metadata.ipoTimestamp = Math.floor(Date.now() / 1000) - 4 * secondsInDay;

      console.log('Ipo:', new Date(props.metadata.ipoTimestamp * 1000));
      console.log('Burn:', new Date(props.metadata.burnTimestamp * 1000));

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
  const [price, setPrice] = useState(-1);

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
    {price !== -1 && (
        <div>Token {props.id} price is {price}</div>
    )}
    </>
  );
}

function ReinvestButton(props) {
  const [message, setMessage] = useState('');

  const handleReinvest = async () => {
    // TODO: checking props to be correct
    try {
      const contractAddress = props.contractAddress;
      const owner = provider.getSigner(props.ownerAddress);
      const contract = new ethers.Contract(contractAddress, abi, owner);

      if (await contract.isBurnable(props.id)) {
        const returnedPrice = await contract.price(props.id, Math.floor(Date.now() / 1000));
        const timeDiff = await contract.diff_ipo_burn_timestamps(props.id);
        const interestRate = await contract.dailyInterestRateById(props.id);
        const metadata = {
          ipoSerial: 0,
          ipoPrice: returnedPrice,
          ipoTimestamp: Math.floor(Date.now() / 1000),
          dailyInterestRate: interestRate,
          burnTimestamp: Math.floor(Date.now() / 1000) + timeDiff * secondsInDay + secondsInDay
        };

        const burn = await contract.burn(props.id);
        await burn.wait();

        const ids = [props.id];
        const tx = await contract.serialMint(props.ownerAddress, ids, metadata);
        await tx.wait();

        console.log('new ipo:', new Date(metadata.ipoTimestamp * 1000));
        console.log('new burn:', new Date(metadata.burnTimestamp * 1000));

        setMessage("Reinvested successfully");
      } else {
        setMessage("Not burnable yet")
      }
    } catch (error) {
      console.error('Reinvestment failed:', error);
    }
  };

  return (
    <>
    <button onClick={handleReinvest}>Reinvest token {props.id}</button>
    {message !== '' && (
        <div>{message}</div>
    )}
    </>
  );
}

function ApproveButton(props) {
  const handleApprove = async () => {

    // TODO: checking props to be correct
    try {
      const spenderAddress = props.dexAddress;
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
  const [dexAddress, setDexAddress] = useState('');

  //Token price values
  const [idPrice, setIdPrice] = useState(0);

  const [idReinvest, setIdReinvest] = useState(0);

  useEffect(() => {
    const fetchTokenData = async () => {
      const token = await getToken();
      if (token) {
        setContractAddress(token.addressToken);
        setOwnerAddress(token.userAddress);
        setDexAddress(token.addressDex);
      }
    };

    fetchTokenData();
  }, []);

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

  const handleIdReinvestChange = (event) => {
    setIdReinvest(event.target.value);
  };

  return (
  <div className="token-wrapper">
    <div className="left-part">
    <h1>Tokens</h1>

    <h4>Your address: {ownerAddress}</h4>

    <h3>Mint NFT</h3>
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
    /><br/>

    <PriceButton
      ownerAddress={ownerAddress}
      id={idPrice}
      contractAddress={contractAddress}
    /><br/>

    <h3>Approve token</h3>
    <ApproveButton
      ownerAddress={ownerAddress}
      dexAddress={dexAddress}
      contractAddress={contractAddress}
    />
    </div>

    <div className="right-part">
    <h1>Reinvestment</h1>
    <label htmlFor="idReinvest">Enter id of token:</label><br/>
    <input
      type="number"
      id="idReinvest"
      value={idReinvest}
      onChange={handleIdReinvestChange}
    /><br/>

    <ReinvestButton
      ownerAddress={ownerAddress}
      id={idReinvest}
      contractAddress={contractAddress}
    /><br/>
    </div>

  </div>
  );
}