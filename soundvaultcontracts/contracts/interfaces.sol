interface IERC20 {

  function totalSupply() external view returns (uint256);

  function balanceOf(address owner) external view returns (uint256);

  function allowance(address owner, address spender)
  external
  view
  returns (uint256);

  function approve(address spender, uint256 value) external returns (bool);

  function transfer(address to, uint256 value) external returns (bool);

  function transferFrom(
    address from,
    address to,
    uint256 value
  ) external returns (bool);

}

interface IERC721 {
    function ownerOf(uint256 id) external view returns (address owner);
    function balanceOf(address owner) external view returns (uint256);
    function transferFrom(address from,address to,uint256 id) external;
    function mint(address ownerAddr, string memory _tokenURI) external returns (uint256);
}

interface IFanNFTFactory {
  function createFanToken(string memory _name, string memory _symbol) external returns (address);
  function mint(address fanNFT, address to) external returns (uint256);
  function upgradeFanContribute(address fanNFT, address to, uint256 contributeToAdd) external;
  function getFanNumber(address fanNFT) external view returns(uint256);
  function getFanContribution(address fanNFT, address fan) external view returns(uint256);
}