// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FanNFT.sol";
import "solmate/src/auth/Owned.sol";


contract FanNFTFactory is Owned{

    string public tokenURI;
    mapping(address => mapping(address => uint256)) fanNFT2userTokenIdMapping;

    constructor(string memory _tokenURI) Owned(msg.sender) {
        tokenURI = _tokenURI;
    }

    function createFanToken(string memory _name, string memory _symbol) external onlyOwner() returns (address){
        FanNFT fanToken = new FanNFT(_name,_symbol);
        return address(fanToken);
    }

    function mint(address fanNFT, address to) external onlyOwner() returns (uint256){
        uint256 tokenId =  FanNFT(fanNFT).mint(to, tokenURI);
        fanNFT2userTokenIdMapping[fanNFT][to] =  tokenId;
        return tokenId;
    }

    function upgradeFanContribute(address fanNFT, address to, uint256 contributeToAdd) public onlyOwner() {
        FanNFT(fanNFT).update(fanNFT2userTokenIdMapping[fanNFT][to], contributeToAdd);
    }

    function getFanNumber(address fanNFT) public view returns(uint256){
        return FanNFT(fanNFT).getFanNumber();
    }

    function getFanContribution(address fanNFT, address fan) public view returns(uint256){
        return FanNFT(fanNFT).tokenId2UserContributeMapping(fanNFT2userTokenIdMapping[fanNFT][fan]);
    }
}