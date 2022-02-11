/**
* MIT License
*
* Copyright (c) 2021
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

// const { Token } = require("@celo/contractkit");
const { assert, expect } = require("chai");
// const Web3EthAbi = require('web3-eth-abi');

advanceBlock = () => {
  return new Promise((resolve, reject) => {
      web3.currentProvider.send({
          jsonrpc: "2.0",
          method: "evm_mine",
          id: new Date().getTime()
      }, (err, result) => {
          if (err) { return reject(err); }
          const newBlockHash = web3.eth.getBlock('latest').hash;

          return resolve(newBlockHash)
      });
  });
}


var CampaignFactoryArtifact = artifacts.require("CampaignList");
var TokenArtifact = artifacts.require("Token");
var CampaignArtifact = artifacts.require("Campaign");


contract("Campaign Factory Tests", async function(accounts) {
//   let accounts;
  let owner, addr1, addr2;
  let admin;
  let loanRequest;
  const router = '0xeD37AEDD777B44d34621Fe5cb1CF594dc39C8192';

    
  before(async function() {
    // accounts = await web3.eth.getAccounts();
    [owner, addr1, addr2] = accounts;
    console.log('owner ', owner, ', add1: ', addr1,', add2: ', addr2);

  });
  



  

  describe("Scenario 1", () => {

    let  campaignFactory;
    let  token;

    before('Initialize and Deploy SmartContracts', async () => {
        // wPBTToken = await WPBTToken.new("Test Tokens", "TTT", 18, 10000000);

        // await wPBTToken.transfer(borrower, 1000000, {
        //     from: admin,
        //     gas: 300000
        // });

        token = await TokenArtifact.new();
        // campaignFactory = await CampaignFactoryArtifact.new();
        //campaignFactory = await CampaignFactoryArtifact.at('0x92Fe2933C795FF95A758362f9535A4D0a516053d');

        campaignFactory = await CampaignFactoryArtifact.deployed();
        console.log('Using Campaign List Deployed at  ', campaignFactory.address );
        
    });

    // it("get the size of the contract", function() {
    //   return CampaignFactoryArtifact.deployed().then(function(instance) {
    //     var bytecode = instance.constructor._json.bytecode;
    //     var deployed = instance.constructor._json.deployedBytecode;
    //     var sizeOfB  = bytecode.length / 2;
    //     var sizeOfD  = deployed.length / 2;
    //     console.log("size of bytecode in bytes = ", sizeOfB);
    //     console.log("size of deployed in bytes = ", sizeOfD);
    //     console.log("initialisation and constructor code in bytes = ", sizeOfB - sizeOfD);
    //   });  
    // });

    it('Creates New Contracts successfully', async() => {
      const now = new Date();
      const twoHoursTime = now.setHours(now.getHours()+2);
      const fourHoursLater = now.setHours(now.getHours()+4);

      try{
        
        const router = '0xeD37AEDD777B44d34621Fe5cb1CF594dc39C8192';
        // const cmp = await CampaignArtifact.deployed();
        const cmp = await CampaignArtifact.at('0x3195875100D00bD85BA2058a05BDDD1D3DaCc6f0');
        console.log('Using Campaign Deployed at  ', cmp.address ); // 0x3195875100D00bD85BA2058a05BDDD1D3DaCc6f0

        
        let encoded = web3.eth.abi.encodeParameters(['uint8[]','bytes32'], [['34','43'], '0x324567fff']);
        console.log('Encoded:  ', encoded );

    //     encoded = web3.eth.abi.encodeParameters(
    //       [
    //           'uint8[]',
    //           {
    //               "ParentStruct": {
    //                   "propertyOne": 'uint256',
    //                   "propertyTwo": 'uint256',
                      
    //               }
    //           }
    //       ],
    //       [
    //           ['34','43'],
    //           {
    //               "propertyOne": '42',
    //               "propertyTwo": '56',
                  
    //           }
    //       ]
    //   );

    //   console.log('Encoded 2:  ', encoded );

        
    //   encoded =  web3.eth.abi.encodeParameters(
    //     [
    //         'uint8[]',
    //         {
    //           "ParentStruct":[{
    //             "releaseDate": 'uint256',
    //             "releaseAmount": 'uint256',
    //             "hasBeenClaimed" : 'bool'
    //           }]
    //         }
    //     ],
    //     [
    //         ['34','43'],
    //         [{
                
    //                 "releaseDate": fourHoursLater,
    //                 "releaseAmount": '500000000000000',
    //                 "hasBeenClaimed" : false
                
    //         }]
    //     ]
    // );

    // console.log('Encoded 3:  ', encoded );

  //   encoded =  web3.eth.abi.encodeParameters(
  //     'tuple(string,uint)[]',
  //     [[['item1', 2], ['item2', 3]]]
  // //   [{
  // //     releaseDate: 1643814669155,
  // //     releaseAmount: '500000000000000',
  // //     hasBeenClaimed: false
  // //   }, 
  // //   {
  // //     releaseDate: 1643814669155,
  // //     releaseAmount: '500000000000000',
  // //     hasBeenClaimed: false
  // //   }
  // // ]
  // );

  // console.log('Encoded 4:  ', encoded );
        // await cmp.updateCampaignDetails(fourHoursLater,false,'logourl', 'desc', 'websiteurl','twitter','telegram',
        // [ [
        //   [fourHoursLater, '500000000000000', false],
        //   [fourHoursLater, '200000000000000', false],
        //   [fourHoursLater, '500000000000000', false],
        //   [fourHoursLater, '200000000000000', false],
        //   [fourHoursLater, '500000000000000', false],
        //   [fourHoursLater, '200000000000000', false],
        //   [fourHoursLater, '500000000000000', false],
        //   [fourHoursLater, '200000000000000', false]
        // ] ],
        // [ [
        //   [fourHoursLater, '500000000000000', false],
        //   [fourHoursLater, '200000000000000', false],
        //   [fourHoursLater, '500000000000000', false],
        //   [fourHoursLater, '200000000000000', false],
        //   [fourHoursLater, '500000000000000', false],
        //   [fourHoursLater, '200000000000000', false],
        //   [fourHoursLater, '500000000000000', false],
        //   [fourHoursLater, '200000000000000', false]
        // ] ],
        // [
        //   '500000000000000',
        //   '500000000000000',
        //   '500000000000000',
        //   '500000000000000'
        //   // ['500000000000000'],
        //   // ['500000000000000'],
        //   // ['500000000000000'],
        //   // ['500000000000000']
        //   // web3.utils.toWei('1', 'ether'),
        //   // web3.utils.toWei('1', 'ether'),
        //   // web3.utils.toWei('1', 'ether'),
        //   // web3.utils.toWei('1', 'ether')
        // ]
        // // ,  { 
        // //           // from: owner,
        // //           value: web3.utils.toWei('0.0001', 'ether')
        // // }
        //  );


         await cmp.updateCampaignDetails(fourHoursLater,false,'logourl', 'desc', 'websiteurl','twitter','telegram',
        [
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false}
        ],
        [
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false}
        ],
        [
          '500000000000000',
          '500000000000000',
          '500000000000000',
          '500000000000000'
          // ['500000000000000'],
          // ['500000000000000'],
          // ['500000000000000'],
          // ['500000000000000']
          // web3.utils.toWei('1', 'ether'),
          // web3.utils.toWei('1', 'ether'),
          // web3.utils.toWei('1', 'ether'),
          // web3.utils.toWei('1', 'ether')
        ]
        // ,  { 
        //           // from: owner,
        //           value: web3.utils.toWei('0.0001', 'ether')
        // }
         );
        
      }catch(err){
        console.error('Error :', err);
        const { error: contractError, reason } = err.data[Object.keys(err.data)[0]];
        console.error('Error :', contractError, ', reason: ' , reason);
        console.error('DError :', err.data);
      }

    //   try{
        
    //     const router = '0xeD37AEDD777B44d34621Fe5cb1CF594dc39C8192';
    //     const cmp = await CampaignArtifact.new(campaignFactory.address, token.address,1,2, twoHoursTime, fourHoursLater,0,router,6000,1000,800,2, {  value: "1000000000000000" });

    //     console.log('Using Campaign Deployed at  ', cmp.address );

    // //     uint liquidityReleaseTimeDays, //Time to add to startTime in days
    // // bool _useWhiteList, 
    // // string memory logoUrl,
    // // string memory desc,
    // // string memory website,
    // // string memory twitter,
    // // string memory telegram,
    // // VestSchedule[8] memory teamTokenVestingDetails, 
    // // VestSchedule[8] memory raisedFundVestingDetails,
    // // uint256[4] memory capDetails

    //     await cmp.updateCampaignDetails(fourHoursLater,false,'logourl', 'desc', 'websiteurl','twitter','telegram',
    //     [
    //       {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
    //       {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false}
    //     ],
    //     [
    //       {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
    //       {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false}
    //     ],
    //     [
    //       1,
    //       1,
    //       1,
    //       1
    //     ],  { 
    //               // from: owner,
    //               //value: web3.utils.toWei('0.0001', 'ether')
    //     } );
        
    //   }catch(err){
    //     console.error('Error :', err);
    //     const { error: contractError, reason } = err.data[Object.keys(err.data)[0]];
    //     console.error('Error :', contractError, ', reason: ' , reason);
    //     console.error('DError :', err.data);
    //   }
      

      // address _tokenAddress,uint _softCap,uint _hardCap, uint256 _saleStartTime, uint256 _saleEndTime,   bool _useWhiteList, Campaign.RefundType _refundType, address _dexRouterAddress,uint _liquidityPercent, uint _listRate, uint _dexListRate,uint _maxAllocationPerUserTierTwo
      // await campaignFactory.createNewCampaign(token.address,1,2, twoHoursTime, fourHoursLater,false,0,router,60,1000,800,2, {
      //   from: owner,
      //   value: web3.utils.toWei('0.0001', 'ether')
      // } );
      /**
      address  _tokenAddress,
    uint256 _softCap,
    uint256 _hardCap, 
    uint256 _saleStartTime, 
    uint256 _saleEndTime,   
    bool _useWhiteList, 
    RefundType _refundType, 
    address _dexRouterAddress,
    uint _liquidityPercent, 
    uint _listRate, 
    uint _dexListRate,
    uint _maxAllocationPerUserTierTwo */
    // let campaign;
    // try{
    //   campaign = await CampaignArtifact.new(token.address,1,2, twoHoursTime, fourHoursLater,false,0,router,6000,1000,800,2);
    // }catch(err){
    //   console.error('Error :', err);
    //   const { error: contractError, reason } = err.data[Object.keys(err.data)[0]];
    //   console.error('Error :', contractError, ', reason: ' , reason);
    //   console.error('DError :', err.data);
    // }
    // // var fcn = function(){
    // //   campaign = await CampaignArtifact.new(token.address,1,2, twoHoursTime, fourHoursLater,false,0,router,6000,1000,800,2,{
    // //     from: owner,
    // //     value: web3.utils.toWei('0.0001', 'ether')
    // //   });
    // // };
    // //   await expect(fcn()).to.be.revertedWith("Contract A reverted");

    //   await advanceBlock();     
      

    //   let contractowner = await campaignFactory.owner.call();

    //   console.log('Factory Owner: ', contractowner );

    //   let length = await campaignFactory.campaignSize.call();
    //   console.log('Campaigns Length: ', length );
      
    //   var r = [];
    //   for (let index = 0; index < length.toNumber(); index++) {
    //     const element = await campaignFactory.campaignAt.call(index);
        
    //     r.push({key:element.key.toNumber(), value:element.value});
        

    //     // const campaign = await CampaignArtifact.at(element.value);
    //     // // myContract.methods.myMethod([arguments]).call()
    //     // console.log('campaign is null : ', campaign );
    //     // let info = await campaign.saleInfo.call();
    //     // console.log('info: ', info );
    //   }
    
      
  });

  it('stops duplicates contract for the same token except when cancelled', async() => {

      // const instance = await MetaCoin.deployed();
      // const balance = await instance.getBalance.call(accounts[0]);
      const now = new Date();
      const twoHoursTime = now.setHours(now.getHours()+2);
      const fourHoursLater = now.setHours(now.getHours()+2);
      
      let createError;
      try{
        await campaignFactory.createNewCampaign(token.address,1,2, twoHoursTime, fourHoursLater,false,0,router,60,1000,800,2, {
          from: owner,
          value: web3.utils.toWei('0.0001', 'ether')
        } );
      
        await advanceBlock();
      }catch(err){
        createError=err;
      }
      assert.notEqual(createError, undefined, 'Transaction should be reverted');

  });


    // it('only Token owners can create contract', async() => {

    //   // const instance = await MetaCoin.deployed();
    //   // const balance = await instance.getBalance.call(accounts[0]);
      

    //   assert.equal(1, 1);

    // });

    

    

  });


})
