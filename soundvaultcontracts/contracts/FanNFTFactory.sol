// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./FanNFT.sol";
import "solmate/src/auth/Owned.sol";


contract FanNFTFactory is Owned{

    string public tokenURI;

    constructor(string memory _tokenURI) Owned(msg.sender) {
        tokenURI = _tokenURI;
    }

    function createFanToken(string memory _name, string memory _symbol) external onlyOwner() returns (address){
        FanNFT fanToken = new FanNFT(_name,_symbol);
        fanToken.transferOwnership(msg.sender);
        return address(fanToken);
    }

    function mint(address fanNFT, address to) external onlyOwner() returns (uint256){
        return FanNFT(fanNFT).mint(to, tokenURI);
    }

}