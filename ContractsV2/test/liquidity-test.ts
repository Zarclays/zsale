// import { expect } from "chai";
// import { ContractFactory } from "ethers";
// import { ethers } from "hardhat";
// import {advanceTimeTo, takeSnapshot, revertToSnapshot} from './utils';

// describe("LiquidityLockerTest", function () {
//   this.timeout(100000);

//   let now = new Date();
//   let OneSecondsTime = now.setSeconds(now.getSeconds() + 1);
//   // const thirtySecondsTime = now.setSeconds(now.getSeconds() + 30);
//   // const twoHoursTime = now.setHours(now.getHours() + 2);
//   // const fourHoursLater = now.setHours(now.getHours() + 4);
//   // const thirtyDaysLater = now.setDate(now.getDate() + 30);
//   // const CampaignFactoryArtifact = undefined;
  
//   // const CampaignArtifact: any = undefined;
//   // const DexLockerFactoryArtifact = undefined;
//   let TokenArtifact: ContractFactory;
//   let LiquidityLockerArtifact: ContractFactory;

//   const router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
//   let campaignFactory: any;
//   let campaign: any;
//   let token: any;
//   let liquidityLocker: any;
//   let campaignAddress: string;

//   const tokenPrice = 2;
//   const minRaisedFunds = 10;
//   const maxRaisedFunds = 40;
//   const liqPercent = 60;


//   async function deployNewLiquidityLocker(secondsToRelease=1){
//     const LiquidityLockerArtifact = await ethers.getContractFactory(
//       "LiquidityLocker"
//     );
//     const [owner, secondAcct, thirdAcct] = await ethers.getSigners();
//     const now = new Date();
//     OneSecondsTime = now.setSeconds(now.getSeconds() + secondsToRelease);

//     const liquidityLocker = await LiquidityLockerArtifact.deploy(
//       router,
//       token.address,
//       thirdAcct.address,
      
//       tokenPrice,
//       Math.floor(OneSecondsTime / 1000),
//       liqPercent ,
//       ethers.utils.formatUnits(ethers.utils.parseEther(minRaisedFunds.toString()), 'wei'),
//       ethers.utils.formatUnits(ethers.utils.parseEther(maxRaisedFunds.toString()), 'wei')
//     );
//     await liquidityLocker.deployed();
//     // send eth
//     const ethExpected = await liquidityLocker.minEthExpected();
    
//     const tx = {
//       from: thirdAcct.address,
//       to: liquidityLocker.address,
//       value: ethExpected, // ethers.utils.parseEther('0.10') // utils.formatUnits( utils.parseEther(amount.toString()), 'wei')
//     };

//     const txRes = await thirdAcct.sendTransaction(tx);
//     const txResult = await txRes.wait();      
//     expect(txRes.confirmations).to.gt(0);

//     // send token
    
//     const tokenExpected = await liquidityLocker.minTokensExpected();      
//     const tokenTranserTx = await token.transfer(
//       liquidityLocker.address,
//       tokenExpected,
//       {
//         from: owner.address
//       }
//     );
//     await tokenTranserTx.wait();

//     return liquidityLocker;
//   }

//   before("Initialize and Deploy SmartContracts", async () => {
//     // CampaignFactoryArtifact = await ethers.getContractFactory("CampaignList");
//     TokenArtifact = await ethers.getContractFactory("Token");
//     // CampaignArtifact = await ethers.getContractFactory("Campaign");
//     // DexLockerFactoryArtifact = await ethers.getContractFactory("DexLockerFactory");

//     token = await TokenArtifact.deploy();
//     await token.deployed();

//     LiquidityLockerArtifact = await ethers.getContractFactory(
//       "LiquidityLocker"
//     );
//   });

//   it("Can Deploy LiquidityLocker", async function () {
//     let error;
//     try {
//       const [owner, secondAcct, thirdAcct] = await ethers.getSigners();
//       now = new Date();
//       OneSecondsTime = now.setSeconds(now.getSeconds() + 100);

//       // address dexRouterAddress, address token, address owner, uint256 price,uint256 releaseTime, uint liquidityPercentOfRaisedFunds,uint minRaisedFunds
//       liquidityLocker = await LiquidityLockerArtifact.deploy(
//         router,
//         token.address,
//         thirdAcct.address,
        
//         tokenPrice,
//         Math.floor(OneSecondsTime / 1000),
//         liqPercent ,
//         ethers.utils.formatUnits(ethers.utils.parseEther(minRaisedFunds.toString()), 'wei'),
//         ethers.utils.formatUnits(ethers.utils.parseEther(maxRaisedFunds.toString()), 'wei')
//       );
//       await liquidityLocker.deployed();
//       // send eth
//       const ethExpected = await liquidityLocker.minEthExpected();
//       const b4Balance = ethers.utils.formatUnits(
//         await ethers.provider.getBalance(liquidityLocker.address)
//       );
      
//       const tx = {
//         from: thirdAcct.address,
//         to: liquidityLocker.address,
//         value: ethExpected, // ethers.utils.parseEther('0.10') // utils.formatUnits( utils.parseEther(amount.toString()), 'wei')
//       };

//       const txRes = await thirdAcct.sendTransaction(tx);
//       const txResult = await txRes.wait();
      
//       const afterBalance = ethers.utils.formatUnits(
//         await ethers.provider.getBalance(liquidityLocker.address)
//       );

      
//       expect(parseFloat(afterBalance)).to.gt(parseFloat(b4Balance));
//       expect(txRes.confirmations).to.gt(0);

//       // send token
      
//       const tokenExpected = await liquidityLocker.minTokensExpected();
      
//       const tokenTranserTx = await token.transfer(
//         liquidityLocker.address,
//         tokenExpected,
//         {
//           from: owner.address
//         }
//       );
//       await tokenTranserTx.wait();

//     } catch (err) {
//       console.error(err);
//       error = err;
//     }

//     expect(error).to.equal(undefined);
//   });

//   it("Can Add Liquidity successfully", async () => {
//     let error;
//     try {
//       const addLqTx = await liquidityLocker.addLiquidity();

//       const txResult = await addLqTx.wait();

//       expect(txResult.status).to.equal(1);

//       const lpTokenPairAddress = await liquidityLocker.lpTokenPairAddress();

//       expect(lpTokenPairAddress).to.not.equal(null);
//       expect(lpTokenPairAddress).to.not.equal(undefined);
//     } catch (err) {
//       error = err;
//     }
//     expect(error).to.equal(undefined);
//   });

//   it("Does not release LP tokens if AddLiquidity is not called", async () => {
//     let error;
//     try {
      
//       const locker = await deployNewLiquidityLocker();
//       const tx = await locker.releaseLPTokens();
//       const txRes = await tx.wait();
            
//     } catch (err) {
//       // console.error('Error duplicating: ', err);
//       error = err;
//     }
//     expect(error).to.not.equal(undefined);
//   });

//   it("Does not release LP tokens before Release time", async () => {
//     let error;
//     try {
//       const locker = await deployNewLiquidityLocker();
//       const tx = await locker.releaseLPTokens();
//       const txRes = await tx.wait();
            
//     } catch (err) {
//       // console.error('Error duplicating: ', err);
//       error = err;
//     }
//     expect(error).to.not.equal(undefined);
//   });

//   it("Releases LP tokens after Release time", async () => {
//     let error;
//     let snapshotId;
//     try {
//       const locker = await deployNewLiquidityLocker(120);
//       const releaseTime = await locker.getReleaseTime();
      

//       await (await locker.addLiquidity()).wait();

//       const lpToken = TokenArtifact.attach(await locker.lpTokenPairAddress() );

//       const lockOwner = await locker.getOwner();
    
//       const lockOwnerPrevBalance = parseFloat(ethers.utils.formatUnits(await lpToken.balanceOf(lockOwner)));

//       snapshotId = await takeSnapshot();
//       await advanceTimeTo(parseInt( ethers.utils.formatUnits(releaseTime.add( 1), '0')) );

//       const tx = await locker.releaseLPTokens();
//       const txRes = await tx.wait();
//       expect(txRes.confirmations).to.gt(0);
      
//       const lockOwnerBalance = parseFloat(ethers.utils.formatUnits(await lpToken.balanceOf(lockOwner)));
      
//       expect(lockOwnerBalance - lockOwnerPrevBalance).to.gt(0);

      

      
//     } catch (err) {
//       console.error('Error : ', err);
//       error = err;
//     }finally{
//         if(snapshotId){
//             await revertToSnapshot(snapshotId);
//         }
        
//     }
//     expect(error).to.equal(undefined);
//   });


//   // it("Releases Tokens after Release time", async () => {
//   //   let error;
//   //   try {
//   //     const locker = await deployNewLiquidityLocker(120);
//   //     const releaseTime = await locker.getReleaseTime();
      

//   //     await (await locker.addLiquidity()).wait();

//   //     const lockOwner = await locker.getOwner();
      

//   //     const lockOwnerPrevBalance = parseFloat(ethers.utils.formatUnits(await token.balanceOf(lockOwner)));

//   //     await advanceTimeTo(parseInt( ethers.utils.formatUnits(releaseTime.add( 1), '0')) );

//   //     const tx = await locker.release();
//   //     const txRes = await tx.wait();
//   //     expect(txRes.confirmations).to.gt(0);
      
//   //     const expectedTokens = await locker.minTokensExpected();
      
//   //     const lockOwnerBalance = parseFloat(ethers.utils.formatUnits(await token.balanceOf(lockOwner)));
//   //     console.log(lockOwnerBalance,', ', lockOwnerPrevBalance, ', ',expectedTokens);
//   //     expect(lockOwnerBalance - lockOwnerPrevBalance).to.gt(expectedTokens);

      
//   //   } catch (err) {
//   //     console.error('Error : ', err);
//   //     error = err;
//   //   }
//   //   expect(error).to.equal(undefined);
//   // });



// });
