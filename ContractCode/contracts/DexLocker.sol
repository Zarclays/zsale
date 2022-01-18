// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./Campaign.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


interface IRouter {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    
}

contract DexLocker{

    using SafeERC20 for IERC20;
    // using SafeMath for uint256;

     // timestamp when token release is enabled
    uint256 private _releaseTime;

    uint256 private _price;

    uint256 private _maxCap;

    uint256 private _mintedBalance;

    address private _owner;

    address private _deployer;

    uint256 constant private MAX_INT = 2**256 - 1;

    

    IERC20 private _token;


    IRouter private _dexRouter;

    constructor(address dexRouterAddress, uint256 releaseTime, address owner, uint256 price) {
        require(releaseTime > block.timestamp, "DexLocker: release time is before current time");
        _releaseTime = releaseTime;
        _dexRouter = IRouter(dexRouterAddress);
        _deployer = msg.sender;
        _price = price;
        _owner = owner;
    }

    function setupToken(IERC20 token) public {
        require(msg.sender == _deployer, "Only deployer can set Token");
        _token = token;
    }

    receive() external payable {

    }

    /**
    * @dev Add Liquidity to Dex at defined price, if no pool exists it will create one.
    *  Approve token for router, require contract to have the necessary tokens
    *
     */
    function addLiquidity() public {
        require(address(_token) != address(0), "DexLocker: Token can not be zero");
        uint256 etherBalance = address(this).balance;
        uint256 tokensAmount = _price * etherBalance;
        uint256 tokensAmountMin = tokensAmount - (_price * etherBalance);
        require(etherBalance > 0, "DexLocker: no ether to add liquidity");
        require( _token.balanceOf(address(this)) > 0, "DexLocker: no token balance to add liquidity");
        require(msg.sender == address(_deployer), "DexLocker: Only deployer can call this function");
        _token.approve(address(_dexRouter), MAX_INT);
  
        _dexRouter.addLiquidityETH(address(_token), tokensAmount , tokensAmount, etherBalance, address(this), block.timestamp + 100);
    }

  

   /**
     * @return the time when the tokens are released.
     */
    function getReleaseTime() public view returns (uint256) {
        return _releaseTime;
    }

      /**
     * @return the owner of the locked funds
     */
    function getOwner() public view returns (address) {
        return _owner;
    }
    
    /**
     * @notice Transfers tokens held by Lock to owner.
       @dev Able to withdraw LP funds after release time 
     */
    function release(IERC20 token) public {
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp >= _releaseTime, "DexLocker: current time is before release time");

        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "DexLocker: no tokens to release");

        token.safeTransfer(_owner, amount);
    }

       /**
     * @notice Transfers ETH back to the owner
       @dev Function used only if it was not used all the ETH
     */
    function releaseETH() public {
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp >= _releaseTime, "DexLocker: current time is before release time");
        require(address(this).balance > 0, "DexLocker: no Eth to release");

        payable(getOwner()).transfer(address(this).balance);
    }
}