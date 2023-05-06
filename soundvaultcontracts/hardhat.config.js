require("@nomicfoundation/hardhat-toolbox");
require('hardhat-gas-reporter');
require('dotenv').config()

const GANACHE_PRIVATE_KEYS = process.env.Ganache.split(",");
const GETH_PRIVATE_KEYS = process.env.GETH.split(",");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  defaultNetwork: "hardhat",
  networks:{
    // Hardhat has a local ethereum network that is run in two flavors. 
    // The "hardhat" network is run in-process, while the "localhost" version is run as a standalone daemon,
    // enabling JSON-RPC and WebSocket connections. 
    // Whenever you run a script, the in-process "hardhat" network is started automatically. 
    // Alternatively, you can run the standalone version using the command npx hardhat node
    localhost : {
    },
    hardhat : {
    },
    ganache : {
      url : "http://127.0.0.1:7545",
      accounts : GANACHE_PRIVATE_KEYS
    },
    bsctest : {
      accounts : [process.env.BNBTest],
      url : "https://data-seed-prebsc-1-s3.binance.org:8545/"
    },
    geth : {
      accounts : GETH_PRIVATE_KEYS,
      url : "https://goerli.infura.io/v3/575c57186c10467fb546ec3125b477de"
    }
  },
  etherscan: {
    apiKey : {
      bscTestnet : process.env.bnbapi,
      goerli : process.env.gethapi
    }
  },
  gasReporter: {
    enabled: true
  },
};
