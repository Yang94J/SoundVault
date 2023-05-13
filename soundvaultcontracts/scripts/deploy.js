const path = require("path");

const FANNFT_TOKENURI = "ipfs://bafybeigecfa5qopre7crfpa24ppasjvtlgbayxww37e2w3b342zz4gl46u/music.jpg";

const VAULT_TOKEN_SUPPLY = 10_000;
const VAULT_TOKEN_NAME = "vaultToken";
const VAULT_TOKEN_SYMBOL = "VMNFT";
const VAULT_TOKEN_DECIMALS = 18;
const VAULT_TOKEN_ALICE_INIT = 100;
const VAULT_TOKEN_BOB_INIT = 100;
const VAULT_TOKEN_JACK_INIT = 100;

const VAULT_NFT_NAME = "VaultMusicNFT";
const VAULT_NFT_SYMBOL = "VT";

async function main() {

  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network ganache'"
    );
  }

  // Read signer info
  const [owner,alice,bob,jack] = await ethers.getSigners();
  console.log("deploy using %s",owner.address);

  const fanNFTFactoryFactory = await ethers.getContractFactory("FanNFTFactory");
  const fanNFTFactory = await fanNFTFactoryFactory.connect(owner).deploy(FANNFT_TOKENURI);
  console.log("fanNFTFactory deployed to %s",fanNFTFactory.address);
  saveFrontendFiles(fanNFTFactory,"FanNFTFactory");

  

  const vaultNFTFactory = await ethers.getContractFactory("VaultNFT");
  const vaultNFT = await vaultNFTFactory.connect(owner).deploy(VAULT_NFT_NAME,VAULT_NFT_SYMBOL);
  console.log("vaultNFT deployed to %s",vaultNFT.address);
  saveFrontendFiles(vaultNFT,"VaultNFT");



  const vaultTokenFactory = await ethers.getContractFactory("VaultToken");
  const vaultToken = await vaultTokenFactory.connect(owner).deploy(VAULT_TOKEN_SUPPLY,VAULT_TOKEN_NAME,VAULT_TOKEN_SYMBOL);
  console.log("vaultToken deployed to %s",vaultToken.address);
  saveFrontendFiles(vaultToken,"VaultToken");

  const musicVaultFactory = await ethers.getContractFactory("MusicVault");
  const musicVault = await musicVaultFactory.connect(owner).deploy(
      vaultToken.address,
      vaultNFT.address,
      fanNFTFactory.address
  );
  console.log("musicVault deployed to %s",musicVault.address);
  saveFrontendFiles(musicVault,"MusicVault");


  await fanNFTFactory.connect(owner).transferOwnership(musicVault.address);
  await vaultNFT.connect(owner).transferOwnership(musicVault.address);

  await vaultToken.connect(owner).transfer(alice.address, BigInt(VAULT_TOKEN_ALICE_INIT * (10 ** VAULT_TOKEN_DECIMALS)));
  await vaultToken.connect(owner).transfer(bob.address, BigInt(VAULT_TOKEN_BOB_INIT * (10 ** VAULT_TOKEN_DECIMALS)));
  await vaultToken.connect(owner).transfer(jack.address, BigInt(VAULT_TOKEN_JACK_INIT * (10 ** VAULT_TOKEN_DECIMALS)));
  
  // Could be commented.
  // await vaultToken.connect(owner).approve(musicVault.address, ethers.constants.MaxUint256);
  // await vaultToken.connect(alice).approve(musicVault.address, ethers.constants.MaxUint256);
  // await vaultToken.connect(bob).approve(musicVault.address, ethers.constants.MaxUint256);
  // await vaultToken.connect(jack).approve(musicVault.address, ethers.constants.MaxUint256);

  // transfer 0.2 eth to wallets for start
  for (const user of [alice,bob,jack]){
    console.log(user.address);
    await owner.sendTransaction({
      to: user.address,
      value : ethers.utils.parseEther("0.2")
    })
  }

}


// Deploy info synced towards disk
function saveFrontendFiles(contract,contractName) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "..", "soundvault-dapp", "config", "contracts");
  {
    fs.writeFileSync(
      path.join(contractsDir, network.name + "-"+ contractName+"Address.json"),
      JSON.stringify({ contract: contract.address }, undefined, 2)
    );
  }
  const Artifact = artifacts.readArtifactSync(contractName);
  fs.writeFileSync(
    path.join(contractsDir, network.name + "-"+ contractName+".json"),
    JSON.stringify(Artifact, null, 2)
  );

}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });