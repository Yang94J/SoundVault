const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const { default: Ethers } = require("@typechain/ethers-v5");


// Constant Define
const FANNFT_TOKENURI = "tokenURL";

const VAULT_TOKEN_SUPPLY = 10_000;
const VAULT_TOKEN_NAME = "vaultToken";
const VAULT_TOKEN_SYMBOL = "VMNFT";
const VAULT_TOKEN_DECIMALS = 18;
const VAULT_TOKEN_ALICE_INIT = 100;
const VAULT_TOKEN_BOB_INIT = 100;
const VAULT_TOKEN_YOUNG_INIT = 100;

const VAULT_NFT_NAME = "VaultMusicNFT";
const VAULT_NFT_SYMBOL = "VT";

const MUSIC_VAULT_UPLOAD_FEE = BigInt(10 * 10 ** (VAULT_TOKEN_DECIMALS));
const MUSIC_FEE = BigInt(2* 10 ** (VAULT_TOKEN_DECIMALS));
const MUSIC_VAULT_VOTE_FEE = BigInt(1 * 10 ** (VAULT_TOKEN_DECIMALS));


describe("MusicVault", function () {

    async function deployFixture(){
        const [owner,alice,bob,young] = await ethers.getSigners();

        const fanNFTFactoryFactory = await ethers.getContractFactory("FanNFTFactory");
        const fanNFTFactory = await fanNFTFactoryFactory.connect(owner).deploy(FANNFT_TOKENURI);

        const vaultNFTFactory = await ethers.getContractFactory("VaultNFT");
        const vaultNFT = await vaultNFTFactory.connect(owner).deploy(VAULT_NFT_NAME,VAULT_NFT_SYMBOL);

        const vaultTokenFactory = await ethers.getContractFactory("VaultToken");
        const vaultToken = await vaultTokenFactory.connect(owner).deploy(VAULT_TOKEN_SUPPLY,VAULT_TOKEN_NAME,VAULT_TOKEN_SYMBOL);

        const musicVaultFactory = await ethers.getContractFactory("MusicVault");
        const musicVault = await musicVaultFactory.connect(owner).deploy(
            vaultToken.address,
            vaultNFT.address,
            fanNFTFactory.address
        );

        await fanNFTFactory.connect(owner).transferOwnership(musicVault.address);
        await vaultNFT.connect(owner).transferOwnership(musicVault.address);

        await vaultToken.connect(owner).transfer(alice.address, BigInt(VAULT_TOKEN_ALICE_INIT * (10 ** VAULT_TOKEN_DECIMALS)));
        await vaultToken.connect(owner).transfer(bob.address, BigInt(VAULT_TOKEN_BOB_INIT * (10 ** VAULT_TOKEN_DECIMALS)));
        await vaultToken.connect(owner).transfer(young.address, BigInt(VAULT_TOKEN_YOUNG_INIT * (10 ** VAULT_TOKEN_DECIMALS)));

        await vaultToken.connect(alice).approve(musicVault.address, ethers.constants.MaxUint256);
        await vaultToken.connect(bob).approve(musicVault.address, ethers.constants.MaxUint256);
        await vaultToken.connect(young).approve(musicVault.address, ethers.constants.MaxUint256);


        return { musicVault, vaultToken, vaultNFT, fanNFTFactory, owner, alice, bob, young};
    }

    async function deployAndUploadFixture(){

    }



    describe("DeployStatus", function (){

        it("fanNFT Factory Initial State",async function(){
            const {musicVault, fanNFTFactory} = await loadFixture(deployFixture);
            expect(await fanNFTFactory.owner()).to.equal(musicVault.address);
            expect(await fanNFTFactory.tokenURI()).to.equal(FANNFT_TOKENURI);
        });        

        it("VaultNFT Initial State",async function(){
            const {musicVault, vaultNFT } = await loadFixture(deployFixture);
            expect(await vaultNFT.owner()).to.equal(musicVault.address);
            expect(await vaultNFT.tokenNumber()).to.equal(0);
            expect(await vaultNFT.name()).to.equal(VAULT_NFT_NAME);
            expect(await vaultNFT.symbol()).to.equal(VAULT_NFT_SYMBOL);
        });

        it("VaultToken Initial State",async function(){
            const {vaultToken,alice,bob,young} = await loadFixture(deployFixture);
            expect(await vaultToken.name()).to.equal(VAULT_TOKEN_NAME);
            expect(await vaultToken.symbol()).to.equal(VAULT_TOKEN_SYMBOL);
            expect(await vaultToken.decimals()).to.equal(VAULT_TOKEN_DECIMALS);

            expect(await vaultToken.totalSupply()).to.equal(
                BigInt(VAULT_TOKEN_SUPPLY * (10 ** VAULT_TOKEN_DECIMALS))
            );

            expect(await vaultToken.balanceOf(alice.address)).to.equal(
                BigInt(VAULT_TOKEN_ALICE_INIT * (10 ** VAULT_TOKEN_DECIMALS))
            );

            expect(await vaultToken.balanceOf(bob.address)).to.equal(
                BigInt(VAULT_TOKEN_BOB_INIT * (10 ** VAULT_TOKEN_DECIMALS))
            );

            expect(await vaultToken.balanceOf(young.address)).to.equal(
                BigInt(VAULT_TOKEN_YOUNG_INIT * (10 ** VAULT_TOKEN_DECIMALS))
            );           
        });

        it("MusicVault Initial State - User",async function(){
            const {musicVault,owner} = await loadFixture(deployFixture);
            expect(await musicVault.userNumber()).to.equal(0);
            expect(await musicVault.getUserVote(owner.address)).to.equal(0);
            expect(await musicVault.getUserPurchase(owner.address)).to.equal(0);
            expect(await musicVault.address2IsUserMapping(owner.address)).to.equal(false);
            expect(await musicVault.getUserCredit(owner.address)).to.equal(1);
            expect((await musicVault.address2UserMapping(owner.address)).fanNFT).to.equal(ethers.constants.AddressZero);
        });

        it("MusicVault Initial State - Content", async function(){
            const {musicVault, vaultToken, vaultNFT, fanNFTFactory, owner} = await loadFixture(deployFixture);
            expect(await musicVault.vaultToken()).to.equal(vaultToken.address);
            expect(await musicVault.vaultNFT()).to.equal(vaultNFT.address);
            expect(await musicVault.fanNFTFactory()).to.equal(fanNFTFactory.address);
            expect(await musicVault.tokenVaultWalletAddress()).to.equal(owner.address);
            expect((await musicVault.getPurchaseLeaderboard()).length).to.equal(0);
            expect((await musicVault.getVoteLeaderboard()).length).to.equal(0);
        });
    });

    describe("Content", function (){
        
        it("Mint - Successfully", async function(){
            const {musicVault, vaultToken, vaultNFT, fanNFTFactory, owner, alice, bob, young} = await loadFixture(deployFixture);

            await expect(musicVault.connect(alice).uploadMusic(
                "musicName",
                "",
                0,
                MUSIC_FEE,
                "test"
                )
            ).to.changeTokenBalances(
                vaultToken,
                [owner,alice],
                [MUSIC_VAULT_UPLOAD_FEE,-MUSIC_VAULT_UPLOAD_FEE]
            );
            expect((await musicVault.getOwneMusicIdList(alice.address)).length).to.equal(1);
            const musicId = (await musicVault.getOwneMusicIdList(alice.address))[0];
            expect ((await musicVault.musicId2MusicMapping(musicId)).musicId).to.equal(musicId);
            expect (await musicVault.contentUploadedMapping(0)).to.equal(true);
            expect (await musicVault.address2IsUserMapping(alice.address)).to.equal(true);
            expect (await musicVault.userNumber()).to.equal(1);
            expect (await vaultNFT.ownerOf(musicId)).to.equal(alice.address);
        });

        it("Mint - Duplicate Failure", async function(){
            const {musicVault, vaultToken, vaultNFT, fanNFTFactory, owner, alice, bob, young} = await loadFixture(deployFixture);
            await musicVault.connect(alice).uploadMusic(
                "musicName","",0,BigInt(1 * (10 ** VAULT_TOKEN_DECIMALS)),"test");
            await expect(musicVault.connect(bob).uploadMusic(
                "musicName2","",0,BigInt(2 * (10 ** VAULT_TOKEN_DECIMALS)),"test")
                ).to.be.revertedWith("already uploaded");
        });

        it("Mint 2, Success", async function(){
            const {musicVault, vaultToken, vaultNFT, fanNFTFactory, owner, alice, bob, young} = await loadFixture(deployFixture);
            await (await musicVault.connect(alice).uploadMusic(
                "musicName","",0,MUSIC_FEE,"test")).wait();
            expect (await vaultNFT.tokenNumber()).to.equal(1);
            await (await musicVault.connect(alice).uploadMusic(
                "musicName","",1,MUSIC_FEE,"test")).wait();
            expect (await vaultNFT.tokenNumber()).to.equal(2);
        })

        it("Purchase", async function(){
            const {musicVault, vaultToken, vaultNFT, fanNFTFactory, owner, alice, bob, young} = await loadFixture(deployFixture);
            await (await musicVault.connect(alice).uploadMusic(
                "musicName","",0,MUSIC_FEE,"test")).wait();
            const musicId = (await musicVault.getOwneMusicIdList(alice.address))[0];
            console.log("1st Id : %d",musicId);

            await expect(musicVault.connect(alice).purchaseMusic(
                musicId,1
            )).to.be.revertedWith("not for author");

            await expect(musicVault.connect(bob).purchaseMusic(
                musicId,1
            )).to.changeTokenBalances(
                vaultToken,
                [alice,bob],
                [MUSIC_FEE,-MUSIC_FEE]
            );

            expect(await musicVault.getUserCredit(bob.address)).to.equal(2);

            await expect(musicVault.connect(bob).purchaseMusic(
                musicId,3
            )).to.be.revertedWith("amount exceeds limit");

            await expect(musicVault.connect(bob).purchaseMusic(
                musicId,2
            )).to.be.revertedWith("only Purchase Once");

            await expect(musicVault.connect(young).purchaseMusic(
                musicId,1
            )).to.changeTokenBalances(
                vaultToken,
                [alice,young],
                [MUSIC_FEE,-MUSIC_FEE]
            );

            expect (await musicVault.userNumber()).to.equal(3);

            await (await musicVault.connect(alice).uploadMusic(
                "musicName","",1,MUSIC_FEE,"test")).wait();
            const musicId2 = (await musicVault.getOwneMusicIdList(alice.address))[1];
            console.log("2nd Id : %d",musicId2);


            await expect(musicVault.connect(young).purchaseMusic(
                musicId2,2
            )).to.changeTokenBalances(
                vaultToken,
                [alice,young],
                [5n * MUSIC_FEE,-5n * MUSIC_FEE]
            );
            
            console.log(await musicVault.getPurchaseLeaderboard());
            // expect((await musicVault.getPurchaseLeaderboard()).length).to.equal(2);
            // expect((await musicVault.getVoteLeaderboard()).length).to.equal(2);

        });

        it("Vote", async function(){
            const {musicVault, vaultToken, vaultNFT, fanNFTFactory, owner, alice, bob, young} = await loadFixture(deployFixture);
            await (await musicVault.connect(alice).uploadMusic(
                "musicName","",0,MUSIC_FEE,"test")).wait();
            const musicId = (await musicVault.getOwneMusicIdList(alice.address))[0];
            console.log("1st Id : %d",musicId);
            await (await musicVault.connect(bob).purchaseMusic(
                musicId,1)).wait();
            await expect(musicVault.connect(alice).voteMusic(musicId,1))
                .to.be.revertedWith("not for author");
            await expect(musicVault.connect(bob).voteMusic(musicId,1)).to.changeTokenBalances(
                vaultToken,
                [alice,bob],
                [MUSIC_VAULT_VOTE_FEE,-MUSIC_VAULT_VOTE_FEE]
            );

        });

    });

    describe("FanInteractions", function (){
        
        it("fanclub interactions", async function(){
            const {musicVault, vaultToken, vaultNFT, fanNFTFactory, owner, alice, bob, young} = await loadFixture(deployFixture);
            expect((await musicVault.address2UserMapping(alice.address)).fanNFT).to.equal(ethers.constants.AddressZero);
            await expect(musicVault.connect(bob).followMusician(alice.address)).to.be.revertedWith("no fanclub");
            await expect (musicVault.getFanNumber(alice.address)).to.be.revertedWith("no fanclub");
            await (await musicVault.connect(alice).createFanNFT()).wait();
            expect((await musicVault.address2UserMapping(alice.address)).fanNFT).to.not.equal(ethers.constants.AddressZero);
            expect (await musicVault.userNumber()).to.equal(1);
            expect (await musicVault.getFanNumber(alice.address)).to.equal(1);
            await expect(musicVault.connect(alice).followMusician(alice.address)).to.be.revertedWith("not eligible");
            await expect(musicVault.connect(bob).followMusician(alice.address)).to.be.revertedWith("not eligible");
            await (await musicVault.connect(alice).uploadMusic(
                "musicName","",0,MUSIC_FEE,"test")).wait();
            const musicId = (await musicVault.getOwneMusicIdList(alice.address))[0];
            expect (await musicVault.userNumber()).to.equal(1);
            await (await musicVault.connect(bob).purchaseMusic(
                musicId,1)).wait();
            await (await musicVault.connect(bob).followMusician(alice.address)).wait();
            expect (await musicVault.userNumber()).to.equal(2);
            expect (await musicVault.getFanNumber(alice.address)).to.equal(2);
            expect (await musicVault.getFanContribution(alice.address,bob.address)).to.equal(0);
            await expect(musicVault.connect(bob).voteMusic(musicId,2)).to.changeTokenBalances(
                vaultToken,
                [alice,bob],
                [5n * MUSIC_VAULT_VOTE_FEE,-5n * MUSIC_VAULT_VOTE_FEE]
            );
            expect (await musicVault.getFanContribution(alice.address,bob.address)).to.equal(2);
        });

        it("fanclub donate", async function(){
            const {musicVault, vaultToken, vaultNFT, fanNFTFactory, owner, alice, bob, young} = await loadFixture(deployFixture);
            await (await musicVault.connect(alice).createFanNFT()).wait();
            await (await musicVault.connect(alice).uploadMusic(
                "musicName","",0,MUSIC_FEE,"test")).wait();
            const musicId = (await musicVault.getOwneMusicIdList(alice.address))[0];
            await (await musicVault.connect(bob).purchaseMusic(
                musicId,1)).wait();
            await expect(musicVault.connect(bob).donateToAuthor(alice.address,MUSIC_FEE))
            .to.be.revertedWith("fan needed");
            await (await musicVault.connect(bob).followMusician(alice.address)).wait();
            expect (await musicVault.getFanContribution(alice.address,bob.address)).to.equal(0);
            await expect(musicVault.connect(bob).donateToAuthor(alice.address,MUSIC_FEE))
            .to.changeTokenBalances(
                vaultToken,
                [alice,bob],
                [MUSIC_FEE,-MUSIC_FEE]
            );
            expect (await musicVault.getFanContribution(alice.address,bob.address)).to.equal(2);
            await expect(musicVault.connect(bob).donateToAuthor(alice.address,MUSIC_FEE))
            .to.be.revertedWith("donation freezing time");
            await ethers.provider.send("hardhat_mine", ["0x500"]);
            await (await musicVault.connect(bob).donateToAuthor(alice.address,2n * MUSIC_FEE)).wait();
            expect (await musicVault.getFanContribution(alice.address,bob.address)).to.equal(6);

            
        });

        it("airdrop", async function(){
            const {musicVault, vaultToken, vaultNFT, fanNFTFactory, owner, alice, bob, young} = await loadFixture(deployFixture);
            await (await musicVault.connect(alice).createFanNFT()).wait();
            await (await musicVault.connect(alice).uploadMusic(
                "musicName","",0,MUSIC_FEE,"test")).wait();
            const musicId = (await musicVault.getOwneMusicIdList(alice.address))[0];
            await (await musicVault.connect(bob).purchaseMusic(
                musicId,1)).wait();
            await (await musicVault.connect(bob).followMusician(alice.address)).wait();
            await (await musicVault.connect(bob).donateToAuthor(alice.address,2n * MUSIC_FEE)).wait();
            await (await musicVault.connect(young).purchaseMusic(
                musicId,1)).wait();
            await (await musicVault.connect(young).followMusician(alice.address)).wait();
            await (await musicVault.connect(alice).uploadMusic(
                "musicName","",1,MUSIC_FEE,"test")).wait();
            const musicId2 = (await musicVault.getOwneMusicIdList(alice.address))[1];
            await expect(musicVault.connect(bob).airdropMusic(musicId2,3)).to.be.revertedWith("author required");
            await (await musicVault.connect(alice).airdropMusic(musicId2,3)).wait();
            expect(await musicVault.musicId2BuyerAmountMapping(musicId2,bob.address)) .to.equal(1);
            expect(await musicVault.musicId2BuyerAmountMapping(musicId2,young.address)) .to.equal(0);

        });
    });

});