// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ContentVault.sol";

// This contract is the content contract to do music-related interactions;
contract FanVault is ContentVault {

    event donate(address author, address fan, uint256 amount);
    event airdrop(address author, uint256 musicId);

    uint256 constant DONATION_INTERVAL = 1_000;
    uint256 constant DONATION_BASE_FEE = 1 ether;

    mapping(address => uint256) donation2BlockMapping;

    constructor(address _vaultToken, address _vaultNFT, address _factory) 
        ContentVault(_vaultToken, _vaultNFT, _factory) {

    }

    function donateToAuthor(address author, uint256 amount) public{
        console.log("blocknum %d",block.number);
        require(donation2BlockMapping[msg.sender]==0 ||  DONATION_INTERVAL + donation2BlockMapping[msg.sender] <  block.number, "donation freezing time");
        address fanNFT = address2UserMapping[author].fanNFT;
        require(fanNFT != address(0) && IERC721(fanNFT).balanceOf(msg.sender)!=0,"fan needed");
        require(amount >= DONATION_BASE_FEE, "unqualified amount");
        donation2BlockMapping[msg.sender] = block.number;
        vaultToken.transferFrom(msg.sender, author, amount);
        fanNFTFactory.upgradeFanContribute(fanNFT, msg.sender, amount / DONATION_BASE_FEE);
        emit donate(author, msg.sender, amount);
    }

    function airdropMusic(uint256 musicId, uint256 contributeEntry) public {
        require(musicId2MusicMapping[musicId].author == msg.sender, "author required");
        address fanNFT = address2UserMapping[msg.sender].fanNFT;
        require(fanNFT != address(0),"no fan club");
        uint256 fanNum = fanNFTFactory.getFanNumber(fanNFT);
        for (uint ind = 0; ind < fanNum; ind++){
            address fan = IERC721(fanNFT).ownerOf(ind);
            if (fanNFTFactory.getFanContribution(fanNFT, fan) > contributeEntry){
                if (musicId2BuyerAmountMapping[musicId][fan]==0){
                    musicId2BuyerAmountMapping[musicId][fan] = 1;
                    buyer2MusicIdMapping[fan].push(musicId);
                }
            }

        }
    }

    function getFanNumber(address _user) public view returns (uint256){
        require(address2UserMapping[_user].fanNFT != address(0),"no fanclub");
        return fanNFTFactory.getFanNumber(address2UserMapping[_user].fanNFT);
    }

    function getFanContribution(address _author, address _fan) public view returns (uint256){
        require(address2UserMapping[_author].fanNFT != address(0),"no fanclub");
        return fanNFTFactory.getFanContribution(address2UserMapping[_author].fanNFT, _fan);
    }
}