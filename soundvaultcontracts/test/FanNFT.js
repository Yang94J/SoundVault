const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("FanNFT", function () {
    async function deployFanNFTFixture(){
        const [owner,alice] = await ethers.getSigners();
        const fanNFTFactory = await ethers.getContractFactory("FanNFT");
        const fanNFT = await fanNFTFactory.connect(owner).deploy("fan","FT");
        return { fanNFT, owner,alice };
    }

    async function deployAndMintFixture(){
        const {fanNFT,owner,alice} = await loadFixture(deployFanNFTFixture);
        const tokenId = (await fanNFT.connect(owner).mint(alice.address,"test")).value;
        return { fanNFT, owner, alice, tokenId };
    }

    describe("Deploy", function (){
        it("owner set",async function(){
            const {fanNFT,owner} = await loadFixture(deployFanNFTFixture);
            expect(await fanNFT.owner()).to.equal(owner.address);
        })

        it ("tokenId start with 0", async function(){
            const {fanNFT,owner} = await loadFixture(deployFanNFTFixture);
            expect(await fanNFT.getFanNumber()).to.equal(0);
        })
    });

    describe("Mint",function() {
        it("mint by owner, success", async function(){
            const {fanNFT,owner,alice} = await loadFixture(deployFanNFTFixture);
            const tokenId = (await fanNFT.connect(owner).mint(alice.address,"test")).value;
            console.log(tokenId);
            expect(await fanNFT.getFanNumber()).to.equal(1);
            expect(await fanNFT.ownerOf(tokenId)).to.equal(alice.address);
            expect(await fanNFT.tokenURI(tokenId)).to.equal("test");
            expect(await fanNFT.balanceOf(alice.address)).to.equal(1);
            expect(await fanNFT.balanceOf(owner.address)).to.equal(0);
        });

        it("mint by non-user, failure", async function(){
            const {fanNFT,owner,alice} = await loadFixture(deployFanNFTFixture);
            // await outside
            await expect( fanNFT.connect(alice).mint(alice.address,"test"))
                .to.be.revertedWith("UNAUTHORIZED");
        });
    });

    describe("update",function(){

        it("beforeUpdate, weight is 0", async function(){
            const {fanNFT,owner,alice,tokenId} = await loadFixture(deployAndMintFixture);
            expect(await fanNFT.tokenId2UserContributeMapping(tokenId)).to.equal(0);
        });


        it("AfterUpdate, weight is correct", async function(){
            const {fanNFT,owner,alice,tokenId} = await loadFixture(deployAndMintFixture);
            const amount = 10;
            await fanNFT.connect(owner).update(tokenId,amount);
            expect(await fanNFT.tokenId2UserContributeMapping(tokenId)).to.equal(amount);
        });
    })

    describe("transfer",function(){
        it("transfer not allowed", async function(){
            const {fanNFT,owner,alice,tokenId} = await loadFixture(deployAndMintFixture);
            await expect( fanNFT.connect(alice).transferFrom(alice.address,owner.address,tokenId))
                .to.be.revertedWith("Cant trade FanNFT");
        });
    });
})