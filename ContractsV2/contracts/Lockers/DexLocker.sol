// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IDexRouter} from "../IDexRouter.sol";
import "./VestSchedule.sol";
import "./TokenLocker.sol";

import "./CoinVestingVault.sol";
import "./LiquidityLocker.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";



// locks liquidity for LP tokens and handles team vseting
contract DexLocker is Initializable{

     // timestamp when token release is enabled
    uint256 private _lpReleaseTime;

    uint256 private _dexListPrice;

    
    address private _owner;

    address private _deployer;

    uint256 constant private MAX_INT = 2**256 - 1;

    uint public totalTokensExpectedToBeLocked;

    address private _token;
    address private _lpTokenPairAddress;

    IDexRouter private _dexRouter;

    TokenLocker private _tokenLocker;
    CoinVestingVault private _coinVault;
    LiquidityLocker private _liquidityLocker;

    /**
    Maps to 
    
        uint256 _percentOfRaisedFundsToLock,
        uint256 _vestingDurationInDays,
        uint256 _vestingCliffInDays
     */
    uint256[3] _raisedFundVestingDetails;
    bool _useRaisedFundsVesting;

    address  _coinVestingVaultImplementationAddress;

    function initialize(address dexRouterAddress, address token,address deployer,address owner, address coinVestingVaultImplementationAddress ) public initializer  {
        _dexRouter = IDexRouter(dexRouterAddress);
        _deployer = deployer; //msg.sender;
        
        _owner = owner;
        _token = token; 
        _coinVestingVaultImplementationAddress=coinVestingVaultImplementationAddress;       
    }

    
    function setupLock(uint liquidityPercentOfRaisedFunds,uint maxRaisedFunds, uint256 lpReleaseTime,  uint256 dexListPrice, bool useTeamTokenVesting, VestSchedule[8] memory teamTokenVestingDetails, bool useRaisedFundsVesting, uint256[3] memory raisedFundVestingDetails 
    ) public {
        require(msg.sender == _deployer, "DexLocker: Only Deployer is allowed ");

        require(lpReleaseTime > block.timestamp, "DexLocker: release time is before current time");
        // require(teamTokenVestingDetails.length == 8, "DEXLocker: TeamTokenVestingDetails length must be 8" );
        // require(raisedFundVestingDetails.length == 8, "DEXLocker: RaisedFundDetails length must be 8" );

        _lpReleaseTime = lpReleaseTime;
        _dexListPrice = dexListPrice;

        // _teamTokenVestingDetails=teamTokenVestingDetails; 

        totalTokensExpectedToBeLocked = 0;
        
        _liquidityLocker = new LiquidityLocker(address(_dexRouter),_token, _owner, dexListPrice, lpReleaseTime, liquidityPercentOfRaisedFunds, maxRaisedFunds);

        totalTokensExpectedToBeLocked = _liquidityLocker.totalTokensExpected();

        if(useTeamTokenVesting){
            
             _tokenLocker = new TokenLocker(_token, _owner,teamTokenVestingDetails );
        }
       
        
        

        for (uint8 i=0; i < 8 /*100%*/; i++) {
            totalTokensExpectedToBeLocked += teamTokenVestingDetails[i].releaseAmount; 
        }

        _useRaisedFundsVesting=useRaisedFundsVesting;
        if(_useRaisedFundsVesting){
            for (uint8 i=0; i < 3 ; i++) {
                _raisedFundVestingDetails[i] = raisedFundVestingDetails[i]; 
            }
        }
        
    }

    function startRaisedFundsLock(
        uint256 _raisedAmount
        
    ) public {
        require(msg.sender == _deployer, "DexLocker: Only Deployer is allowed ");

        if(_useRaisedFundsVesting){
            address newCoinVaultCloneAddress = Clones.clone(_coinVestingVaultImplementationAddress);
            _coinVault = CoinVestingVault(payable(newCoinVaultCloneAddress) );
            // _coinVault.initialize(_owner, _startTime,_amount, _vestingDurationInDays,_vestingCliffInDays);

             _coinVault.initialize(_owner,block.timestamp, _raisedFundVestingDetails[0] * _raisedAmount /1000, _raisedFundVestingDetails[1],_raisedFundVestingDetails[2]);

            
        }
        
    }

    receive() external payable {
        // payable(_coinLocker).transfer(msg.value);
    }

    function receiveCoinVaultCoins() public payable {
        payable(_coinVault).transfer(msg.value);
    }

    /**
    * @dev Add Liquidity to Dex at defined price, if no pool exists it will create one.
    *  Approve token for router, require contract to have the necessary tokens
    *
     */
    function addLiquidity() public {
        _liquidityLocker.setCampaignSucceded(true);
        _liquidityLocker.addLiquidity();
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
        _liquidityLocker.releaseLPTokens(); 
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
    function releaseCoinVaultETH() public {
        _coinVault.claimVestedCoins();
    }

    function coinVaultAddress() public view returns (address) {
        return address(_coinVault);
    }

    function tokenLockerAddress() public view returns (address) {
        return address(_tokenLocker);
    }

    function liquidityLockerAddress() public view returns (address) {
        return address(_liquidityLocker);
    }
}