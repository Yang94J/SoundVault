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
    function mint(address investorAddr, string memory tokenURI, uint share) external;
}