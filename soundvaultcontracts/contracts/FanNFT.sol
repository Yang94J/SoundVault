// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "solmate/src/tokens/ERC721.sol";
import "solmate/src/auth/Owned.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// FanNFT is controlled by FanNFTFactory;
contract FanNFT is ERC721, Owned{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    mapping(uint => string) private tokenId2TokenURIMapping;
    mapping(uint => uint) public tokenId2UserContributeMapping;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name,_symbol)
        Owned(msg.sender)
    {
        
    }

    function mint(address ownerAddr, string memory _tokenURI)
        public onlyOwner()
        returns (uint256)
    {
        uint256 newItemId = _tokenId.current();
        _mint(ownerAddr, newItemId);
        setTokenURI(newItemId, _tokenURI);

        _tokenId.increment();
        return newItemId;
    }

    function setTokenURI(uint256 id, string memory _tokenURI) public onlyOwner() {
        tokenId2TokenURIMapping[id] = _tokenURI;
    }

    function tokenURI(uint256 id) public view override returns (string memory){
        return tokenId2TokenURIMapping[id];
    }

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public override {
        revert("Cant trade FanNFT");
    }
    
    function update(uint256 tokenId, uint256 contributeToAdd)
        public onlyOwner(){
        tokenId2UserContributeMapping[tokenId] += contributeToAdd;
    }

    // For airdrop
    function getFanNumber() public view returns(uint256){
        return _tokenId.current();
    }
}