import { ethers } from 'ethers';
import React, { useState } from 'react';
import contractArtifacts from '../artifacts/contracts/LibraCurrency.sol/LibraTokenCurrency.json';
import "./LibraCurrencyFront.css"

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', { chainId: 1337 });
const abi = contractArtifacts.abi;

const OwnerToContract = {
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8": "0x59F2f1fCfE2474fD5F0b9BA1E73ca90b143Eb8d0",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC": "0xF6168876932289D073567f347121A267095f3DD6",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906": "0xcf27F781841484d5CF7e155b44954D7224caF1dD"
};

function MintButton(props) {

  const handleMint = async () => {

    // TODO: checking props to be correct
    try {
      const contractAddress = OwnerToContract[props.ownerAddress];
      console.log('ownerAddress:', props.ownerAddress);
      console.log('signerAddress:', provider.getSigner(props.ownerAddress));
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
      const contractAddress = OwnerToContract[props.ownerAddress];
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
  const [ownerAddress, setOwnerAddress] = useState('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

  //Currency approve values
  const [amountApprove, setAmountApprove] = useState(0);

  //Currency mint handlers
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleReceiverAddressChange = (event) => {
    setReceiverAddress(event.target.value);
  };

  const handleOwnerAddressChange = (event) => {
    setOwnerAddress(event.target.value);
  }

  //Currency approve handlers

  const handleAmountApproveChange = (event) => {
    setAmountApprove(event.target.value);
  };

  return (
  <div>
    <h1>Currency</h1>
    <label htmlFor="ownerAddress">Choose address to mint from:</label><br/>
    <select name="ownerAddress" onChange={handleOwnerAddressChange}>
      <option value="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266">0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</option>
      <option value="0x70997970C51812dc3A010C7d01b50e0d17dc79C8">0x70997970C51812dc3A010C7d01b50e0d17dc79C8</option>
      <option value="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC">0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC</option>
      <option value="0x90F79bf6EB2c4f870365E785982E1f101E93b906">0x90F79bf6EB2c4f870365E785982E1f101E93b906</option>
    </select><br/>

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

    <MintButton ownerAddress={ownerAddress} amount={amount} receiverAddress={receiverAddress} /><br/>

    <h3>Approve currency</h3>
    <label htmlFor="amountApprove">Enter amount to approve:</label><br/>
    <input
      type="number"
      id="amountApprove"
      value={amountApprove}
      onChange={handleAmountApproveChange}
    /><br/>

    <ApproveButton ownerAddress={ownerAddress} amount={amountApprove}/>
  </div>
  );
}