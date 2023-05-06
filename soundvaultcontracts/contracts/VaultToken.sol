// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "solmate/src/tokens/ERC20.sol";


// Vault Token is used for platform Governance
contract VaultToken is ERC20 {
    constructor(uint256 _initialSupply, string memory _tokenName, string memory _tokenSymbol)
        ERC20(_tokenName,_tokenSymbol,18) 
    {
        _mint(msg.sender, _initialSupply * (1 ether));
    }
}