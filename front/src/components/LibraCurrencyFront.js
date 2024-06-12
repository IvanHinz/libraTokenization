import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import contractArtifacts from '../artifacts/contracts/LibraCurrency.sol/LibraTokenCurrency.json';
import "./LibraCurrencyFront.css";
import {getToken} from '../useToken.js';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', { chainId: 1337 });
const abi = contractArtifacts.abi;

function MintButton(props) {

  const handleMint = async () => {
    try {
      const contractAddress = props.contractAddress;
      console.log('ownerAddress:', props.ownerAddress);
      const owner = provider.getSigner(props.ownerAddress);
      const contract = new ethers.Contract(contractAddress, abi, owner);

      console.log('Minting', props.amount.toString(), 'LBTC to', props.receiverAddress);

      const tx = await contract.mint(props.receiverAddress, ethers.utils.parseUnits(props.amount, 18));
      await tx.wait();
      console.log('Minting successful!', props.amount);
      console.log('Balance', ethers.utils.formatUnits(await contract.balanceOf(props.receiverAddress), 18));
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  return (
    <button onClick={handleMint}>Mint {props.amount} LBTC</button>
  );
}

function BalanceButton(props) {
  const [balance, setBalance] = useState(-1);

  const handleBalance = async () => {

    try {
      const contractAddress = props.contractAddress;
      const owner = provider.getSigner(props.ownerAddress);
      const contract = new ethers.Contract(contractAddress, abi, owner);
      setBalance(ethers.utils.formatUnits(await contract.balanceOf(props.receiverAddress), 18));
    } catch (error) {
      console.error('Couldn\'t get balance:', error);
    }
  };

  return (
    <>
    <button onClick={handleBalance}>Balance</button>
    {balance !== -1 && (
        <div>Balance is {balance}</div>
    )}
    </>
  );
}

function TotalSupply(props) {
  const [amount, setAmount] = useState(-1);

  const getSupply = async () => {
    try {
      const contractAddress = props.contractAddress;
      const owner = provider.getSigner(props.ownerAddress);
      const contract = new ethers.Contract(contractAddress, abi, owner);
      setAmount(ethers.utils.formatUnits(await contract.totalSupply(), 18));
    } catch (error) {
      console.error('Couldn\'t get supply:', error);
    }
  };

  return (
    <>
    <button onClick={getSupply}>Total supply</button>
    {amount !== -1 && (
        <div>Total supply is {amount}</div>
    )}
    </>
  );
}

function ApproveButton(props) {
  const handleApprove = async () => {

    try {
      const spenderAddress = props.dexAddress;
      const contractAddress = props.contractAddress;
      console.log('ownerAddress:', props.ownerAddress);
      console.log('spenderAddress:', spenderAddress);
      const owner = provider.getSigner(props.ownerAddress);
      const contract = new ethers.Contract(contractAddress, abi, owner);

      const tx = await contract.connect(owner).approve(spenderAddress, ethers.utils.parseUnits(props.amount, 18));
      await tx.wait();
      const allowance = await contract.allowance(props.ownerAddress, spenderAddress);
      console.log('Total approved:', ethers.utils.formatUnits(allowance, 18));
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  return (
    <button onClick={handleApprove}>Approve</button>
  );
}

export default function LaunchCurrency() {
  //Currency mint values
  const [amount, setAmount] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [balanceAddress, setBalanceAddress] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [dexAddress, setDexAddress] = useState('');

  useEffect(() => {
    const fetchTokenData = async () => {
      const token = await getToken();
      if (token) {
        setContractAddress(token.addressCurrency);
        setOwnerAddress(token.userAddress);
        setDexAddress(token.addressDex);
      }
    };

    fetchTokenData();
  }, []);

  //Currency approve values
  const [amountApprove, setAmountApprove] = useState(0);

  //Currency mint handlers
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleReceiverAddressChange = (event) => {
    setReceiverAddress(event.target.value);
  };

  const handleBalanceAddressChange = (event) => {
    setBalanceAddress(event.target.value);
  };

  //Currency approve handlers

  const handleAmountApproveChange = (event) => {
    setAmountApprove(event.target.value);
  };

  return (
  <div className="currency-wrapper">
    <h1>Currency</h1>

    <h4>Your address: {ownerAddress}</h4>
    <TotalSupply
      ownerAddress={ownerAddress}
      contractAddress={contractAddress}
    />

    <h3>Mint tokens</h3>
    <label htmlFor="amount">Enter amount to mint:</label><br/>
    <input
      type="number"
      id="amount"
      value={amount}
      onChange={handleAmountChange}
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
      amount={amount}
      contractAddress={contractAddress}
      receiverAddress={receiverAddress}
    /><br/>

    <label htmlFor="balanceAddress">Balance of:</label><br/>
    <input
      type="text"
      id="balanceAddress"
      value={balanceAddress}
      onChange={handleBalanceAddressChange}
    /><br/>

    <BalanceButton
      ownerAddress={ownerAddress}
      receiverAddress={balanceAddress}
      contractAddress={contractAddress}
    /><br/>

    <h3>Approve currency</h3>
    <label htmlFor="amountApprove">Enter amount to approve:</label><br/>
    <input
      type="number"
      id="amountApprove"
      value={amountApprove}
      onChange={handleAmountApproveChange}
    /><br/>

    <ApproveButton
      ownerAddress={ownerAddress}
      dexAddress={dexAddress}
      contractAddress={contractAddress}
      amount={amountApprove}
    />
  </div>
  );
}