// SPDX-License-Identifier: MIT
pragma solidity  0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILibraTokenCurrency is IERC20 {
}

interface ILibraTokenAsset is IERC721 {
    function price(uint256 tokenId, uint256 currentTimestamp) external view returns (uint256);
    function isBurnable (uint256 tokenId)  external view returns (bool);
    function burn(uint256 tokenId) external;
    function owner() external returns (address);
}

contract LibraTokenDEX is IERC721Receiver {
    ILibraTokenCurrency private _currencyContract;
    ILibraTokenAsset private _assetContract;

    constructor(address _currencyContractAddress, address _assetContractAddress) {
        _currencyContract = ILibraTokenCurrency(_currencyContractAddress);
        _assetContract = ILibraTokenAsset(_assetContractAddress);
    }

    function buyAsset(uint256 assetId, uint256 currentTimestamp) external {
        uint256 assetPrice = _assetContract.price(assetId, currentTimestamp);
        address ownerOfToken = _assetContract.owner(); 
        _assetContract.safeTransferFrom(ownerOfToken, msg.sender, assetId);
        _currencyContract.transferFrom(msg.sender, ownerOfToken, assetPrice);
    }

    function sell(uint256 assetId, uint256 currentTimestamp) external {
        // if burnable then sell for currency that gives contract of a currency else then sell to a person on a market
        // uint256 assetPrice = _assetContract.price(assetId, currentTimestamp);
        // _assetContract.safeTransferFrom(msg.sender, address(this), assetId);
        // _currencyContract.transferFrom(msg.sender, ownerOfToken, assetPrice);
        // _currencyContract.transfer(msg.sender, assetPrice);
        // if(_assetContract.isBurnable(assetId)){
        //     _assetContract.burn(assetId);
        // }
    }

    function onERC721Received(address, address, uint256, bytes calldata) external override pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}