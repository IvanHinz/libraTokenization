import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import contractArtifacts from '../artifacts/contracts/LibraCurrency.sol/LibraTokenCurrency.json';
import "./LibraCurrencyFront.css";
import {getToken} from '../useToken.js';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', { chainId: 1337 });
const abi = contractArtifacts.abi;

function MintButton(props) {

  const handleMint = async () => {

    // TODO: checking props to be correct
    try {
      const contractAddress = props.contractAddress;
      console.log('ownerAddress:', props.ownerAddress);
      const owner = provider.getSigner(props.ownerAddress);
      const contract = new ethers.Contract(contractAddress, abi, owner);


      // Debugging: Log the signer address
      const ownerAddress = await owner.getAddress();
      console.log('owner address:', ownerAddress);
      // Debugging: Log the receiver address and amount
      console.log('Minting', props.amount.toString(), 'LBTC to', props.receiverAddress);

      const tx = await contract.connect(owner).mint(props.receiverAddress, ethers.utils.parseUnits(props.amount, 18));
      await tx.wait();
      console.log('Minting successful! ', props.amount);
      console.log('Balance', ethers.utils.formatUnits(await contract.balanceOf(props.receiverAddress), 18));
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  return (
    <button onClick={handleMint}>Mint {props.amount} LBTC</button>
  );
}

function ApproveButton(props) {
  const spenderAddress = "0x95bD8D42f30351685e96C62EDdc0d0613bf9a87A";

  const handleApprove = async () => {

    // TODO: checking props to be correct
    try {
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
  const [ownerAddress, setOwnerAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  useEffect(() => {
    const fetchTokenData = async () => {
      const token = await getToken();
      if (token) {
        setContractAddress(token.addressCurrency);
        setOwnerAddress(token.userAddress);
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

  //Currency approve handlers

  const handleAmountApproveChange = (event) => {
    setAmountApprove(event.target.value);
  };

  return (
  <div>
    <h1>Currency</h1>

    <h4>Your address: {ownerAddress}</h4>
    <h4>Your currency contract address: {contractAddress}</h4>

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
      contractAddress={contractAddress}
      amount={amountApprove}
    />
  </div>
  );
}