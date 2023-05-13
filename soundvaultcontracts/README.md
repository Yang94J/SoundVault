# Soundvault Contracts

## Introduction

At MusicVault, our vision is to be a web3 music platform that connects content creators and fans. We enable creators to produce and sell their music for profit while also providing a platform for fan engagement through membership clubs. Our mission is to create a vibrant and sustainable ecosystem for the music industry that empowers both artists and fans.

## Contracts Structure

- contracts (.sol files regarding musicvault)
  - MusicVault.sol : platform contract
    - FanVault.sol : wrap interactions between creators and fans, including donation, airdrop, etc.
      - ContentVault.sol : music-oriented, including upload, purchase, vote, etc.
        - UserVault : record user information, could be regarded as Identity
  - VaultNFT.sol : ERC721 collections used to identity the music created
  - VaultToken.sol : The governance token used to perform the daily transactions. Could be usdt, wbnb, weth or 3rd party token.
  - FanNFT.sol : A NFT collection would be generated for one musician, the FanNFT is introduced.
  - FanNFTFactory.sol  : used by MusicaVault to dynamically manage FanNFT, including creating, minting, credit updating, etc.

- scripts (deploy script)
  - deploy.js : deploy the contracts to a specified network

- test

  - FanNFT.js : test for FanNFT.sol functionalities

  - MusicVault.js test for musicvault platform

## Functions

- Upload Music: Creators can upload their music works to the smart contract and set metadata such as price and description.
- Purchase Music: Users can interact with the contract to buy music works uploaded by creators and transfer payments to the creator's wallet.
- Voting: Users can interact with the smart contract to vote for their favorite music works.
- NFT Issuance: Creators can convert their music works into NFTs for ease of collection and trading.
- Fan Clubs: Creators can create and manage their fan clubs and interact with fans through smart contracts.
- Donations/Airdrops: Users can donate to creators and creators can set criteria for airdrops of their works.
- Copyright Management: The smart contract can manage the copyright information of music works, such as ensuring that only authorized users can purchase and use music works. In addition, the smart contract can also manage the copyright revenue allocated to artists and other collaborators.
- Automated Allocation: The smart contract can automatically distribute sales revenue to relevant parties, such as composers, lyricists, performers, producers, etc., based on preset allocation rules. This will greatly simplify the process of copyright distribution.
- User reputation management: Users' interaction history with the platform determines their reputation, incentivizing users to use and provide feedback on the platform, while introducing quadratic voting to limit centralization.

## How to setup

- compile

  ```javascript
  npx hardhat compile
  ```

- test

  ```
  npx hardhat test
  ```

- deploy

  ```
  npx hardhat deploy --network testbsc
  ```

- verify

  ```
  npx hardhat verify --network bsctest <contract_address> "contract_param1" ...
  
  npx hardhat verify --network bsctest --contract contracts/MusicVault.sol:MusicVault <contract_address> "contract_param1" ...
  ```

  

## To be improved

As I am working alone after work, some interesting features should be (not yet) implemented, but they will eventually come. These points include:

- Improve User reputation management module
- Map user with web2 social identity to better boost the community
- Empower on vaultToken with a certain mechanism