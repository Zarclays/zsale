// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import {IDexRouter, IDexFactory} from "../IDexRouter.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./VestSchedule.sol";



// locks liquidity for LP tokens and handles team vseting
contract LiquidityLocker{

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
    address private _lpTokenPairAddress;

    IDexRouter private _dexRouter;


    

    VestSchedule[] tokenVestSchedule ;

    constructor(address dexRouterAddress, IERC20 token, address owner, uint256 price,uint256 releaseTime) {
        require(releaseTime > block.timestamp, "LiquidityLocker: release time is before current time");
        _releaseTime = releaseTime;
        _dexRouter = IDexRouter(dexRouterAddress);
        _deployer = msg.sender;
        _price = price;
        _owner = owner;
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
        require(msg.sender == address(_deployer), "LiquidityLocker: Only deployer can call this function");
        require(address(_token) != address(0), "LiquidityLocker: Token can not be zero");
        uint256 etherBalance = address(this).balance;
        uint256 tokensAmount = _price * etherBalance;
        uint256 tokensAmountMin = tokensAmount - (_price * etherBalance);
        require(etherBalance > 0, "LiquidityLocker: no ether to add liquidity");
        require( _token.balanceOf(address(this)) > 0, "LiquidityLocker: no token balance to add liquidity");
        
        _token.approve(address(_dexRouter), MAX_INT);
        
        
        _dexRouter.addLiquidityETH(address(_token), tokensAmount , tokensAmount, etherBalance, address(this), block.timestamp + 100);

        _lpTokenPairAddress = IDexFactory(_dexRouter.factory() ).getPair(address(_token), _dexRouter.WETH() );
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
    function releaseLPTokens() public {
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp >= _releaseTime, "LiquidityLocker: current time is before release time");

        IERC20 token=IERC20(_lpTokenPairAddress);
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "LiquidityLocker: no LP tokens to release");

        token.safeTransfer(_owner, amount); 
    }

    /**
     * @notice Transfers tokens held by Lock to owner.
       @dev Able to withdraw LP funds after release time 
     */
    function release(IERC20 token) public {
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp >= _releaseTime, "LiquidityLocker: current time is before release time");

        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "LiquidityLocker: no tokens to release");

        token.safeTransfer(_owner, amount); 
    }

       /**
     * @notice Transfers ETH back to the owner
       @dev Function used only if it was not used all the ETH
     */
    function releaseETH() public {
        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp >= _releaseTime, "LiquidityLocker: current time is before release time");
        require(address(this).balance > 0, "LiquidityLocker: no Eth to release");

        payable(getOwner()).transfer(address(this).balance);
    }
}