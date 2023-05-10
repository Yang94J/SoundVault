// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserVault.sol";
import "./interfaces.sol";

// This contract is the content contract to do music-related interactions;
contract ContentVault is UserVault{

    event musicUpload(address indexed musician, uint256 indexed musicId, string musicName );
    event musicPurchase(address indexed buyer, uint256 indexed musicId, string musicName, uint256 amount);
    event musicVote(address indexed buyer, uint256 indexed musicId, string musicName, uint256 amount);
    event fanClubCreate(address indexed musician, address indexed fanNFT);
    event fanClubJoin(address indexed musician, address indexed fanNFT, address indexed fan);
    event leaderBoardRefresh();

    // music struct, rarely changed
    struct music {
        uint256 musicId; // for token
        string musicName; // music Basic Info
        address author; // music author, would enjoy voting reflections
        string musicDescription; // music Description
        string cid; // to prove uniqueNess of the content
        uint256 purchaseFee; // baseFee for purchasing
        uint256 uploadTimestamp; // uploadTimestamp, could be used for refreshLeaderBoard @suppressed
        uint256 purchaseAmount; // amount of purchase
        uint256 purchaseRevenue; // total Revenue from purchase
        uint256 voteAmount; // amount of vote
        uint256 voteRevenue; // total Revenue from vote
    }


    // music create FEE @prevent malicious attack
    uint256 constant CREATE_BASE_FEE = 10 ether;

    // music vote FEE
    uint256 constant VOTE_BASE_FEE = 1 ether;

    // Max LEADERBOARD LENGTH
    uint256 constant LEADERBORAD_LENGTH = 10;

    // for demo purpose, would set this to 0
    // Wouldn't regard too much of tokenomics
    uint256 constant TAX = 0;

    // total number of music in the vault
    uint256 public musicNumber;

    // total number of purchase in the vault
    uint256 public purchaseNumer;

    // total value of purchase
    uint256 public purchaseTokenAmount;

    // vaultToken for governance and payment
    IERC20  public vaultToken;

    // vaultNFT representing NFT
    IERC721 public vaultNFT;

    // Factory to generate FanNFT based on requests
    // seperate to simplify the code
    IFanNFTFactory public fanNFTFactory;

    // the wallet used to receive Create music fee
    address public tokenVaultWalletAddress; 

    // musicId to Music struct
    mapping(uint256 => music) public musicId2MusicMapping;

    // musician to MusicId Array mapping
    mapping(address => uint256[]) public owner2MusicIdMapping;

    // content Duplication check mapping
    mapping(string => bool) public contentUploadedMapping;

    // collector(including musicOwner himeself) to MusicId mapping
    mapping(address => uint256[]) public collector2MusicIdMapping;

    // music to collector copy amount, just for recording
    mapping(uint256 => mapping(address => uint256)) public musicId2CollectorAmountMapping;

    // music to collector copy amount, just for recording
    mapping(uint256 => mapping(address => uint256)) public musicId2CollectorVoteAmountMapping;

    // check for fan eligible
    mapping(address => mapping(address => bool)) public author2userEligibleMapping;


    // LeaderBoard for musicPurchase List
    // uint256[] musicPurchaseLeaderboard = new uint256[](LEADERBORAD_LENGTH);
    uint256[] musicPurchaseLeaderboard = new uint256[](0);

    // LeaderBoard for musicVote List
    // uint256[] musicVoteLeaderboard = new uint256[](LEADERBORAD_LENGTH);
    uint256[] musicVoteLeaderboard = new uint256[](0);

    // threshold to enter loop process
    uint256 thresholdForPurchase = 0;
    uint256 thresholdForVote = 0;

    // should be greater than 0 but no exceeds user credit limit
    modifier amountCheck(address _user, uint amount){
        require(amount > 0,"invalid Purchase Amount");
        require(amount <= getUserCredit(_user), "amount exceeds limit");
        _;
    }

    // vaultToken, vaultNFT & 
    constructor(address _vaultToken, address _vaultNFT, address _factory) UserVault() {
        vaultToken = IERC20(_vaultToken); 
        vaultNFT = IERC721(_vaultNFT); // should transfer Ownership after creation of platform
        fanNFTFactory = IFanNFTFactory(_factory); // should transfer Ownership after creation of platform
        tokenVaultWalletAddress = msg.sender;
    }

    // Upload Music to Generate NFT
    // @vuln kinda vulnerable to frontRun Attack?
    function uploadMusic(string memory musicName,
                         string memory musicDescription,
                         string memory cid,
                         uint256 purchaseFee,
                         string memory tokenURI) public returns(uint256){
        
        require(!contentUploadedMapping[cid],"already uploaded");

        vaultToken.transferFrom(msg.sender, tokenVaultWalletAddress, CREATE_BASE_FEE);
        uint256 musicId = vaultNFT.mint(msg.sender, tokenURI);

        // init Vaule for music struct
        musicId2MusicMapping[musicId].musicId = musicId;
        musicId2MusicMapping[musicId].musicName = musicName;
        musicId2MusicMapping[musicId].author = msg.sender;
        musicId2MusicMapping[musicId].musicDescription = musicDescription;
        musicId2MusicMapping[musicId].cid = cid;
        musicId2MusicMapping[musicId].purchaseFee = purchaseFee;
        musicId2MusicMapping[musicId].uploadTimestamp = block.timestamp;

        // state change
        owner2MusicIdMapping[msg.sender].push(musicId);
        collector2MusicIdMapping[msg.sender].push(musicId);
        musicId2CollectorAmountMapping[musicId][msg.sender] = 1;
        musicId2CollectorVoteAmountMapping[musicId][msg.sender] = 1;

        contentUploadedMapping[cid] =  true;

        musicNumber += 1;

        registerUser(msg.sender);

        emit musicUpload(msg.sender, musicId, musicName);

        return musicId;
    }

    // FAN NFT create, triggered by user request
    function createFanNFT(string memory fanNFTName) public {
        require(address2UserMapping[msg.sender].fanNFT==address(0),"already created");
        address fanNFT = fanNFTFactory.createFanToken(fanNFTName, "FT");
        address2UserMapping[msg.sender].fanNFT = fanNFT;
        fanNFTFactory.mint(fanNFT, msg.sender);
        registerUser(msg.sender);
        emit fanClubCreate(msg.sender, fanNFT);
    }

    function setFanChatId(string memory fanchatId) public {
        require(address2UserMapping[msg.sender].fanNFT!=address(0),"no fanclub");
        address2UserMapping[msg.sender].chatId = fanchatId;
    }

    // follow to mint
    function followMusician(address author) public{
        address authorFanNFT = address2UserMapping[author].fanNFT;
        require(authorFanNFT != address(0),"no fanclub");
        require(author2userEligibleMapping[author][msg.sender],"not eligible");
        require(IERC721(authorFanNFT).balanceOf(msg.sender)==0, "already fan");
        fanNFTFactory.mint(authorFanNFT, msg.sender);
        registerUser(msg.sender);
        emit fanClubJoin(author, authorFanNFT, msg.sender);
    }

    // Purchase Music
    function purchaseMusic(uint256 musicId, uint256 amount) public amountCheck(msg.sender,amount){
        address author = musicId2MusicMapping[musicId].author;
        require(musicId2CollectorAmountMapping[musicId][msg.sender]==0,"already owned");

        uint256 amountToPay = calculateSquaredFee(musicId2MusicMapping[musicId].purchaseFee,amount);

        // The revenue should be given to the owner of the vaultNFT, author and owner may not be the same
        vaultToken.transferFrom(msg.sender, vaultNFT.ownerOf(musicId), amountToPay);

        // state changes
        musicId2CollectorAmountMapping[musicId][msg.sender] = amount;
        collector2MusicIdMapping[msg.sender].push(musicId);

        address2UserMapping[msg.sender].purchase +=  amount;
        address2UserMapping[msg.sender].totalExpense += amountToPay;

        address2UserMapping[author].soldCopy += amount;
        address2UserMapping[author].totalRevenue += amountToPay;

        purchaseNumer += amount;
        purchaseTokenAmount += amountToPay;

        // verify eligble for airdrop
        if (!author2userEligibleMapping[author][msg.sender]){
            author2userEligibleMapping[author][msg.sender] = true;
        }

        // for leaderboard
        updateMusicPurchase(musicId, amount,amountToPay);

        // upgrade fan contributions
        upgradeFanContribute(author,msg.sender,amount);

        registerUser(msg.sender);

        emit musicPurchase(msg.sender, musicId, musicId2MusicMapping[musicId].musicName, amount);
    }

    // Calculate Squared Fee to add decentralization
    function calculateSquaredFee(uint256 baseFee, uint256 amount) public pure returns (uint256){
        return amount * (amount + 1) * (2 * amount + 1) / 6 * baseFee;
    }

    // calculate purchaseFee of musicId with amount given
    function calculatePurchaseFee(uint256 musicId, uint256 amount) public view returns (uint256){
        return calculateSquaredFee(musicId2MusicMapping[musicId].purchaseFee, amount);
    }

    // vote for music of amount of votes given
    function voteMusic(uint256 musicId, uint256 amount) public amountCheck(msg.sender,amount){
        address author = musicId2MusicMapping[musicId].author;
        require(musicId2CollectorVoteAmountMapping[musicId][msg.sender]==0,"already voted");
        uint256 amountToPay = calculateVoteFee(amount);
        // The vote is given to author
        vaultToken.transferFrom(msg.sender, author, amountToPay);

        // state changes
        musicId2CollectorVoteAmountMapping[musicId][msg.sender] =  amount;

        address2UserMapping[msg.sender].vote += 1;
        address2UserMapping[msg.sender].totalExpense += amountToPay;

        address2UserMapping[author].receivedVote += amount;
        address2UserMapping[author].totalRevenue += amountToPay;

        // LeaderBoard Refresh
        updateMusicVote(musicId,amount,amountToPay);
        // upgrade fan contributions
        upgradeFanContribute(author,msg.sender,amount);

        registerUser(msg.sender);

        emit musicVote(msg.sender, musicId, musicId2MusicMapping[musicId].musicName, amount);
    }

    // calculate for votes fees
    function calculateVoteFee(uint256 amount) public pure returns (uint256){
        return calculateSquaredFee(VOTE_BASE_FEE, amount);
    }

    // update purchase related info for music
    function updateMusicPurchase(uint256 musicId, uint256 amount, uint256 amountToPay) internal{


        // update information
        musicId2MusicMapping[musicId].purchaseAmount += amount;
        musicId2MusicMapping[musicId].purchaseRevenue += amountToPay;

        if (searchMusidIdinPurchaseLeaderboard(musicId)){
            return;
        }

        // if there is enough space for leaderboard
        if (musicPurchaseLeaderboard.length < LEADERBORAD_LENGTH){
            musicPurchaseLeaderboard.push(musicId);
            emit leaderBoardRefresh();
        }else{
            // check if necessary to loop
            if (musicId2MusicMapping[musicId].purchaseAmount > thresholdForPurchase){
                updateMusicPurchaseLeaderboard(musicId);
            }
        }
    }

    function searchMusidIdinPurchaseLeaderboard(uint musicId) view internal returns (bool){
        uint len = musicPurchaseLeaderboard.length;
        for (uint ind = 0; ind < len; ind++){
            if (musicPurchaseLeaderboard[ind] == musicId){
                return true;
            }
        }
        return false;
    }

    // loop the leaderboard to see, if it will be updated?
    function updateMusicPurchaseLeaderboard(uint musicId) internal {
        uint len = musicPurchaseLeaderboard.length;
        uint indMin = 0;
        uint valueMin = type(uint256).max;
        for (uint ind = 0; ind < len; ind++){
            if (musicId2MusicMapping[musicPurchaseLeaderboard[ind]].purchaseAmount < valueMin){
                indMin = ind;
                valueMin = musicId2MusicMapping[musicPurchaseLeaderboard[ind]].purchaseAmount;
            }
        }
        if (valueMin < musicId2MusicMapping[musicId].purchaseAmount){
            thresholdForPurchase = valueMin;
            musicPurchaseLeaderboard[indMin] = musicId;
            emit leaderBoardRefresh();
        }
    }

    // same as purchaseAmount
    function updateMusicVote(uint256 musicId, uint256 amount,uint256 amountToPay) internal{
        musicId2MusicMapping[musicId].voteAmount += amount;
        musicId2MusicMapping[musicId].voteRevenue += amountToPay;

        if (searchMusidIdinVoteLeaderboard(musicId)){
            return;
        }

        if (musicVoteLeaderboard.length < LEADERBORAD_LENGTH){
            musicVoteLeaderboard.push(musicId);
            emit leaderBoardRefresh();
        }else{
            if (musicId2MusicMapping[musicId].voteAmount > thresholdForVote){
                updateMusicVoteLeaderboard(musicId);
            }
        }
    }

    function searchMusidIdinVoteLeaderboard(uint musicId) view internal returns (bool){
        uint len = musicVoteLeaderboard.length;
        for (uint ind = 0; ind < len; ind++){
            if (musicVoteLeaderboard[ind] == musicId){
                return true;
            }
        }
        return false;
    }

    function updateMusicVoteLeaderboard(uint musicId) internal {
        uint len = musicVoteLeaderboard.length;
        uint indMin = 0;
        uint valueMin = type(uint256).max;
        for (uint ind = 0; ind < len; ind++){
            if (musicId2MusicMapping[musicVoteLeaderboard[ind]].voteAmount < valueMin){
                indMin = ind;
                valueMin = musicId2MusicMapping[musicVoteLeaderboard[ind]].voteAmount;
            }
        }
        if (valueMin < musicId2MusicMapping[musicId].voteAmount){
            thresholdForVote = valueMin;
            musicVoteLeaderboard[indMin] = musicId;
            emit leaderBoardRefresh();
        }
    }

    // for leaderboard function
    function getPurchaseLeaderboard() public view returns (uint256[] memory list) {
        list = new uint256[](musicPurchaseLeaderboard.length);
        for (uint i = 0; i<list.length; i++){
            list[i] = musicPurchaseLeaderboard[i];
        }
        return list;
    }

    // for leaderboard function
    function getVoteLeaderboard() public view returns (uint256[] memory list) {
        list = new uint256[](musicVoteLeaderboard.length);
        for (uint i = 0; i<list.length; i++){
            list[i] = musicVoteLeaderboard[i];
        }
        return list;
    }

    function upgradeFanContribute(address author,address fan,uint256 amount) internal{
        address fanNFT = address2UserMapping[author].fanNFT;
        if (fanNFT != address(0) && IERC721(fanNFT).balanceOf(fan)!=0){
            fanNFTFactory.upgradeFanContribute(fanNFT, fan, amount);
        }
    }

    function registerUser(address _user) internal{
        if (!address2IsUserMapping[_user]) {
            address2IsUserMapping[_user] =  true;
            userNumber += 1;
        }
    }

    function getOwnerMusicNumber(address _user) public view returns(uint256){
        return owner2MusicIdMapping[_user].length;
    }

    function getCollectorMusicNumber(address _user) public view returns(uint256){
        return collector2MusicIdMapping[_user].length;
    }

    function getOwnerMusicIdList(address _user) public view returns(uint256[] memory){
        uint256 len = getOwnerMusicNumber(_user);
        uint256[] memory list = new uint256[](len);
        for (uint i = 0; i < len; i++){
            list[i] = owner2MusicIdMapping[_user][i];
        }
        return list;
    }

    function getCollectorMusicIdList(address _user) public view returns(uint256[] memory){
        uint256 len = getCollectorMusicNumber(_user);
        uint256[] memory list = new uint256[](len);
        for (uint i = 0; i < len; i++){
            list[i] = collector2MusicIdMapping[_user][i];
        }
        return list;
    }

}
