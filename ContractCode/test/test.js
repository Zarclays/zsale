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

const { Token } = require("@celo/contractkit");
const { assert, expect } = require("chai");

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


var CampaignFactoryArtifact = artifacts.require("CampaignFactory");
var TokenArtifact = artifacts.require("Token");
var CampaignArtifact = artifacts.require("Campaign");


contract("Campaign Factory Tests", async function(accounts) {
//   let accounts;
  let owner, addr1, addr2;
  let admin, borrower, lender;
  let loanRequest;

    
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

        token = await TokenArtifact.deployed();
        campaignFactory = await CampaignFactoryArtifact.new();
        //campaignFactory = await CampaignFactoryArtifact.at('0xd12d5237c15ae556dA3564A9F9F8beCAfE85C617');
        console.log('Using Factory Deployed at  ', campaignFactory.address );
        
    });

    it('Creates New Contracts successfully', async() => {
      const now = new Date();
      const twoHoursTime = now.setHours(now.getHours()+2);
      const fourHoursLater = now.setHours(now.getHours()+2);
      const router = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
      await campaignFactory.createNewCampaign(token.address,100,200, twoHoursTime, fourHoursLater,false,0,router,60,1000,800, {
        from: owner,
        value: web3.utils.toWei('0.0001', 'ether')
      } );
    
      await advanceBlock();     
      

      let contractowner = await campaignFactory.owner.call();

      console.log('Factory Owner: ', contractowner );

      let length = await campaignFactory.campaignSize.call();
      console.log('Campaigns Length: ', length );
      
      var r = [];
      for (let index = 0; index < length.toNumber(); index++) {
        const element = await campaignFactory.campaignAt.call(index);
        
        r.push({key:element.key.toNumber(), value:element.value});
        

        // const campaign = await CampaignArtifact.at(element.value);
        // // myContract.methods.myMethod([arguments]).call()
        // console.log('campaign is null : ', campaign );
        // let info = await campaign.saleInfo.call();
        // console.log('info: ', info );
      }
      
  });

    // it('stops duplicates contract for the same token', async() => {

    //     // const instance = await MetaCoin.deployed();
    //     // const balance = await instance.getBalance.call(accounts[0]);
    //     const now = new Date();
    //     const twoHoursTime = now.setHours(now.getHours()+2);
    //     const fourHoursLater = now.setHours(now.getHours()+2);
    //     const router = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
    //     let createError;
    //     try{
    //       await campaignFactory.createNewCampaign(token.address,100,200, twoHoursTime, fourHoursLater,false,0,router,60,1000,800, {
    //         from: owner,
    //         value: web3.utils.toWei('0.0001', 'ether')
    //       } );
        
    //       await advanceBlock();
    //     }catch(err){
    //       createError=err;
    //     }
    //     assert.notEqual(createError, undefined, 'Transaction should be reverted');

    // });


    // it('only Token owners can create contract', async() => {

    //   // const instance = await MetaCoin.deployed();
    //   // const balance = await instance.getBalance.call(accounts[0]);
      

    //   assert.equal(1, 1);

    // });

    

    

  });


})
