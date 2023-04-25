// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// This contract is the base contract to store user-related Information;
contract User {

    // user struct
    // make it simple
    struct user {
        uint purchase;
        uint vote;
        address fanNFT;
    }

    // user address mapping to User
    mapping( address => user) public address2UserMapping;

    constructor() {

    }

    // get credit value for user (equals to the sum of the purchase and vote, plus 1 to start with 1 without vote or purchase)
    // credit value can be used to restrict user's input amount to restrict 51% attack on voting
    function getUserCredit(address user) public view returns(uint){
        return address2UserMapping[user].purchase + address2UserMapping[user].vote + 1;
    }

    // get user purchase amount, for display
    function getUserPurchase(address user) public view returns(uint){
        return address2UserMapping[user].purchase;
    }

    // get user vote amount, for display
    function getUserVote(address user) public view returns(uint){
        return address2UserMapping[user].vote;
    }

}