# SouldVault Dapp Introduction

The musicvault-dapp is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

## configuration

- **Particale Network** and **Web3MQ** are important libs intergrated. PNapi.js and web3mqapi.js have to be placed under conifg/apikey folder to provide necessary api information.
- After contract deploy, json files are generated under config/contracts folder, make sure to correctly point to the files in libs/musicVault.js and libs/vaultToken.js
- Change settings in _app.js to change blockchain network required.

## Wallet

The project uses ether.js to deal with particle network provider:

```
const web3provider = useParticleProvider();
provider = new ethers.providers.Web3Provider(web3provider);
musicVault = getMusicVault(provider);
signer = provider.getSigner();
```

## Interaction

The Dapp is purely web3, so there is no backend server and no user information could be selected.

## To improved

- UI Design : I am not an official front-end developper, so some UI design is just rough drafts. Should be improved later for better performance.
- Interactions : Some functions including donation and airdrop are not fully realized in dapp due to time issues.

## Particle Network

- Web2/Web3 user management 

  Thanks to particle network who provides a nice sdk of the log in/out and management of accounts. The sdk integrating web2 methods such as Google Auth2, email login, and GitHub login into web3, and the form of MPC custody is also innovative.

- IPFS Gateway

  With the IPFS gateway provided by Particle Network, I can quickly implement the upload and download of music files and NFT metadata.

## Web3MQ

- Web2-like IM

  The lack of real-time interaction has always been a problem in WEB3. **Web3MQ connects creators and fans through chat rooms, which not only increases user stickiness but also provides a more user-friendly Web2-like experience, reducing the customer acquisition threshold.** I have always thought that if third-party hosted wallets and message queues can be linked together, it will be a great experience in WEB3!

