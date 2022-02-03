// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import {IDexRouter} from "../IDexRouter.sol";
import "./VestSchedule.sol";
import "./TokenLocker.sol";
import "./CoinLocker.sol";
import "./LiquidityLocker.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";



// locks liquidity for LP tokens and handles team vseting
contract DexLocker{

    using SafeERC20 for IERC20;
    // using SafeMath for uint256;

    

     // timestamp when token release is enabled
    uint256 private _lpReleaseTime;

    uint256 private _dexListPrice;

    
    address private _owner;

    address private _deployer;

    uint256 constant private MAX_INT = 2**256 - 1;

    

    IERC20 private _token;
    address private _lpTokenPairAddress;

    IDexRouter private _dexRouter;

    TokenLocker private _tokenLocker;
    CoinLocker private _coinLocker;
    LiquidityLocker private _liquidtyLocker;


    /**
    Total team vesting tokens

    firstTokenReleasetime
    firstTokenReleasePercent
    vestingPeriod (in days)
    vestingPercent
     */
    uint256[5] private _teamTokenVestingDetails; 

    /**
    Total vesting tokens

    firstCoinReleasetime
    firstCoinReleasePercent
    CoinvestingPeriod (in days)
    CoinvestingPercent
     */
    uint256[5] private _raisedFundVestingDetails; 


    constructor(address dexRouterAddress, IERC20 token,address owner){
        _dexRouter = IDexRouter(dexRouterAddress);
        _deployer = msg.sender;
        
        _owner = owner;
        _token = token;        
    }

    
    function setupLock(uint256 lpReleaseTime,  uint256 dexListPrice, VestSchedule[8] memory teamTokenVestingDetails, VestSchedule[8] memory raisedFundVestingDetails) public {
        require(msg.sender == _deployer, "DexLocker: Only Deployer is allowed ");

        require(lpReleaseTime > block.timestamp, "DexLocker: release time is before current time");
        require(teamTokenVestingDetails.length == 5, "DEXLocker: TeamTokenVestingDetails length must be 5" );
        require(raisedFundVestingDetails.length == 5, "DEXLocker: RaisedFundDetails length must be 5" );

        _lpReleaseTime = lpReleaseTime;
        _dexListPrice = dexListPrice;

        // _teamTokenVestingDetails=teamTokenVestingDetails; 

        // _raisedFundVestingDetails=raisedFundVestingDetails;

        _liquidtyLocker = new LiquidityLocker(address(_dexRouter),_token, _owner, dexListPrice, lpReleaseTime);
        //IERC20 token, address owner, uint256 price, uint256 totalVestingTokens, uint256 firstTokenReleasetime,uint256 firstTokenReleasePercent,uint256 vestingPeriod,uint256 vestingPercent
        _tokenLocker = new TokenLocker(_token, _owner,teamTokenVestingDetails );


        _coinLocker = new CoinLocker(_owner,raisedFundVestingDetails );
    }

    receive() external payable {
        payable(_coinLocker).transfer(msg.value);
    }

    /**
    * @dev Add Liquidity to Dex at defined price, if no pool exists it will create one.
    *  Approve token for router, require contract to have the necessary tokens
    *
     */
    function addLiquidity() public {
        _liquidtyLocker.addLiquidity();
    }

  

   /**
     * @return the time when the LP tokens are released.
     */
    function getLiquidityReleaseTime() public view returns (uint256) {
        return _lpReleaseTime;
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
        _liquidtyLocker.releaseLPTokens(); 
    }

    /**
     * @notice Transfers tokens held by Lock to owner.
     */
    function release() public {
        _tokenLocker.release();
    }

    /**
     * @notice Transfers ETH back to the owner
     */
    function releaseETH() public {
        _coinLocker.release();
    }

    function coinLockerAddress() public view returns (address) {
        return address(_coinLocker);
    }

    function tokenLockerAddress() public view returns (address) {
        return address(_tokenLocker);
    }

    function liquidityLockerAddress() public view returns (address) {
        return address(_liquidtyLocker);
    }
}