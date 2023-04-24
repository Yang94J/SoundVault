// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./User.sol";
import "./interfaces.sol";

// This contract is the content contract to do music-related interactions;
contract ContentVault is User{

    event musicUpload(address indexed musician, uint256 indexed, address musicName );
    

    // music struct 
    struct Music {
        uint256 musicId; // for token
        string musicName; // music Basic Info
        address author; // music author
        string musicDescription; // music Description
        uint256 contentHash; // cidr ? 
        uint256 purchaseFee; // baseFee for purchasing
    }

    // music response
    struct MusicSellInfo {
        uint256 purchaseTime;
        uint256 revenue;
        uint256 voteTime;
    }

    uint256 constant CREATE_BASE_FEE = 10 ether;
    uint256 constant VOTE_BASE_FEE = 1 ether;
    uint256 constant LEADERBORAD_LENGTH = 10;

    IERC20  public vaultToken;
    IERC721 public vaultNFT;
    IFanNFTFactory public fanNFTFactory;

    // musicId to Music
    mapping(uint256 => Music) public musicId2MusicMapping;

    // musician to MusicId mapping
    mapping(address => uint256[]) public owner2MusicIdMapping;

    // deduplicate for music content 
    mapping(uint256 => bool) public contentUploaded;

    // buyer to MusicId mapping
    mapping(address => uint256[]) public buyer2MusicIdMapping;

    // music to buyer purchase amount
    mapping(uint256 => mapping(address => uint256)) music2BuyerAmountMapping;



    constructor(address _vaultToken, address _vaultNFT, address _factory) User() {
        vaultToken = IERC20(_vaultToken);
        vaultNFT = IERC721(_vaultNFT);
        fanNFTFactory = IFanNFTFactory(_factory);
    }

    // Upload Music to Generate NFT
    // @vuln kinda vulnerable to frontRun Attack?
    function uploadMusic(string memory musicName,
                         string memory musicDescription,
                         uint256 contentHash,
                         uint256 purchaseFee,
                         string memory tokenURI) public {
        
        require(!contentUploaded[contentHash],"already uploaded");

        vaultToken.transferFrom(msg.sender, address(this), CREATE_BASE_FEE);
        uint256 musicId = vaultNFT.mint(msg.sender, tokenURI);

        // init Vaule
        musicId2MusicMapping[musicId].musicId = musicId;
        musicId2MusicMapping[musicId].musicName = musicName;
        musicId2MusicMapping[musicId].author = msg.sender;
        musicId2MusicMapping[musicId].musicDescription = musicDescription;
        musicId2MusicMapping[musicId].contentHash = contentHash;
        musicId2MusicMapping[musicId].purchaseFee = purchaseFee;

        // state change
        owner2MusicIdMapping[msg.sender].push(musicId);
        contentUploaded[musicId] =  true;

    }

    // FAN NFT create, triggered by user request
    function createFanNFT() public {
        address fanNFT = fanNFTFactory.createFanToken("FanNFT", "FT");
        address2UserMapping[msg.sender].fanNFT = fanNFT;
        fanNFTFactory.mint(fanNFT, msg.sender);
    } 

    function purchase(uint256 musicId, uint256 amount) public{
        require(music2BuyerAmountMapping[musicId][msg.sender]==0,"only Purchase Once");
        require(amount > 0,"invalid Purchase Amount");

        uint256 amountToPay = calculateSquaredFee(musicId2MusicMapping[musicId].purchaseFee,amount);

        music2BuyerAmountMapping[musicId][msg.sender] = amount;
    }

    function calculateSquaredFee(uint256 baseFee, uint256 amount) public pure returns (uint256){
        return 0;
    }
}
