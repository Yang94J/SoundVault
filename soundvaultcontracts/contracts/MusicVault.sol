pragma solidity ^0.8.0;

import "./FanVault.sol";

// Final Logic Contract to be implemented
contract MusicVault is FanVault {
    constructor(address _vaultToken, address _vaultNFT, address _factory) 
        FanVault(_vaultToken, _vaultNFT, _factory) {
    }
}