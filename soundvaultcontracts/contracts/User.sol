// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// This contract is the base contract to store user-related Information;
contract User {

    // user struct
    struct user {
        uint purchase;
        uint vote;
        uint joinTimestamp;
        address fanNFT;
    }

    // mapping to User
    mapping( address => user) public address2UserMapping;

    // get vote limit for user (equals to the sum of the purchase and vote)
    function getUserVoteLimit(address user) public view returns(uint){
        return address2UserMapping[user].purchase + address2UserMapping[user].vote;
    }
}