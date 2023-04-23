// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "solmate/src/tokens/ERC721.sol";
import "solmate/src/auth/Owned.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Vault Token is used for platform Governance
// Dont want to include 
contract VaultNFT is ERC721, Owned{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    mapping(uint => string) private tokenId2TokenURIMapping;

    constructor(string memory _name, string memory _symbol, address owner)
        ERC721(_name,_symbol)
        Owned(owner)
    {
        
    }

    function mint(address investorAddr, string memory tokenURI, uint share)
        public onlyOwner()
        returns (uint256)
    {
        uint256 newItemId = _tokenId.current();
        _mint(investorAddr, newItemId);
        setTokenURI(newItemId, tokenURI);

        _tokenId.increment();
        return newItemId;
    }

    function setTokenURI(uint256 id, string memory tokenURI) public onlyOwner() {
        tokenId2TokenURIMapping[id] = tokenURI;
    }

    function tokenURI(uint256 id) public view override returns (string memory){
        return tokenId2TokenURIMapping[id];
    }

}