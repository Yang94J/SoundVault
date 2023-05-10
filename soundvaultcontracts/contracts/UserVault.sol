// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

// This contract is the base contract to store user-related Information;
contract UserVault {

    // user struct
    // make it simple
    struct user {
        uint purchase; // amount of purchase copy
        uint vote; // amount of votes send out
        uint totalExpense; // amount of token expended
        uint totalRevenue; // amount of token received
        uint soldCopy; // amount of sold copy
        uint receivedVote; // amount of vote received
        address fanNFT; // address of fanNFT
        string chatId; // chatid for web3mq
    }

    // user address mapping to User
    mapping( address => user) public address2UserMapping;
    
    uint256 public userNumber;

    mapping( address => bool) public address2IsUserMapping;

    constructor() {

    }

    // get credit value for user (equals to the sum of the purchase and vote, plus 1 to start with 1 without vote or purchase)
    // credit value can be used to restrict user's input amount to restrict 51% attack on voting
    function getUserCredit(address _user) public view returns(uint){
        return address2UserMapping[_user].purchase + address2UserMapping[_user].vote + 1;
    }

    // get user purchase amount, for display
    function getUserPurchase(address _user) public view returns(uint){
        return address2UserMapping[_user].purchase;
    }

    // get user vote amount, for display
    function getUserVote(address _user) public view returns(uint){
        return address2UserMapping[_user].vote;
    }

}