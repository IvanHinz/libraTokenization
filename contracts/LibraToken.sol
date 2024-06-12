// SPDX-License-Identifier: MIT
pragma solidity  0.8.20;

// openzeppelin contracts must be installed with "npm install @openzeppelin/contracts"
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

uint256 constant secondsInDay = 86400;

uint8 constant interestRateDecimals = 9;
uint256 constant interestRateMultiplier = 100 * 10 ** interestRateDecimals;

contract LibraToken is ERC721, ERC721Enumerable, Ownable  {
    // метаданные
    struct Metadata {
        uint256 ipoSerial;
        uint256 ipoPrice; // цена первичного выпуска
        uint256 ipoTimestamp; // время первичного выпуска токена
        uint256 dailyInterestRate; // дневная процентная ставка
        uint256 burnTimestamp; // время сжигания
    }

    constructor() ERC721("LibraToken", "LBT") Ownable (msg.sender) {}

    // Mapping from token id to token data
    mapping(uint256 => Metadata) private _metadataMapping;

    function serialMint(address to, uint256[] memory tokenIds, Metadata memory inputMetadata) external {
        // Metadata memory inputMetadata in input
        for (uint256 i = 0; i < tokenIds.length; i++){
            _metadataMapping[tokenIds[i]] = inputMetadata;
            // _metadataMapping[tokenIds[i]].ipoTimestamp = block.timestamp;
            _safeMint(to, tokenIds[i]);
        }
    }

    event MyEvent(uint256 timestamp);

    function currentTimestamp() external view returns (uint256){
        return block.timestamp;
    }

    function price(uint256 tokenId, uint256 neededTimestampForPrice) external view returns (uint256)  {
        _requireMinted(tokenId);

        uint256 ipoTimestamp = _metadataMapping[tokenId].ipoTimestamp;
        uint256 daysSinceIpo = (neededTimestampForPrice - ipoTimestamp) / secondsInDay;
        uint256 ipoPrice = _metadataMapping[tokenId].ipoPrice;
        uint256 dailyInterestRate = _metadataMapping[tokenId].dailyInterestRate;

        return (ipoPrice * ((dailyInterestRate + interestRateMultiplier) ** daysSinceIpo)) / (interestRateMultiplier) ** daysSinceIpo;
        // return (neededTimestampForPrice, ipoTimestamp);
    }

    function dailyInterestRateById(uint256 tokenId) public view returns (uint256){
        uint256 dailyInterestRate = _metadataMapping[tokenId].dailyInterestRate;
        return dailyInterestRate;
    }

    function diff_ipo_burn_timestamps(uint256 tokenId) public view returns (uint256){
        uint256 ipoTimestamp = _metadataMapping[tokenId].ipoTimestamp;
        uint256 burnTimestamp = _metadataMapping[tokenId].burnTimestamp;
        uint256  diff_ipo_burn_days = (burnTimestamp - ipoTimestamp) / secondsInDay;
        return diff_ipo_burn_days;
    }

    function _requireMinted(uint tokenId) internal view virtual {        
        require(ownerOf(tokenId) != address(0), "LBT: token does not exist");
    }

    function metadata(uint256 tokenId) external view returns (Metadata memory) {
        _requireMinted(tokenId);
        return _metadataMapping[tokenId];
    }

    function isBurnable (uint256 tokenId) public view returns (bool) {
        _requireMinted(tokenId);
        return block.timestamp > _metadataMapping[tokenId].burnTimestamp;
    }

    function burn(uint256 tokenId) public {
        owner();
        // require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        require(isBurnable(tokenId), "LBT: burn date is not yet reached");
        _burn(tokenId);
        delete _metadataMapping[tokenId];
    }

    // функция для просмотра владельца контракта
    function return_owner() public view returns(address) {
        return owner();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        return ERC721._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, amount);
    }
}