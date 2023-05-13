import { ethers } from "ethers";

// import addressjson from '../config/contracts/ganache-VaultTokenAddress.json';
// import artifact from '../config/contracts/ganache-VaultToken.json'

// import addressjson from '../config/contracts/geth-VaultTokenAddress.json';
// import artifact from '../config/contracts/geth-VaultToken.json'

import addressjson from '../config/contracts/bsctest-VaultTokenAddress.json';
import artifact from '../config/contracts/bsctest-VaultToken.json'

const address = addressjson.contract;
const abi = artifact.abi;
const getVaultToken = function(provider){
    return new ethers.Contract(address,abi,provider);
}
export default getVaultToken;