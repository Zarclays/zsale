import { expect } from "chai";
import { ethers } from "hardhat";



describe("CampaignList", function () {
  
   this.timeout(100000);

  const now = new Date();
  const thirtySecondsTime = now.setSeconds(now.getSeconds()+15);
  const twoHoursTime = now.setHours(now.getHours()+2);
  const fourHoursLater = now.setHours(now.getHours()+4);
  const thirtyDaysLater = now.setDate(now.getDate()+30);
  let CampaignFactoryArtifact = undefined;
  let TokenArtifact = undefined;
  let CampaignArtifact:any  = undefined;
  let DexLockerFactoryArtifact = undefined;

  const router = '0xeD37AEDD777B44d34621Fe5cb1CF594dc39C8192';
  let  campaignFactory: any;
  let campaign:any;
  let  token: any;
  let campaignAddress: string;
  

  before('Initialize and Deploy SmartContracts', async () => {
      
      CampaignFactoryArtifact = await ethers.getContractFactory("CampaignList");
      TokenArtifact = await ethers.getContractFactory("Token");
      CampaignArtifact = await ethers.getContractFactory("Campaign");
      DexLockerFactoryArtifact = await ethers.getContractFactory("DexLockerFactory");


      token = await TokenArtifact.deploy();
      await token.deployed();

      const token2 = await TokenArtifact.deploy();
      await token2.deployed();
      console.log('Token2 Deployed at  ', token2.address );

      const dexLockerFactory = await DexLockerFactoryArtifact.deploy();
      await dexLockerFactory.deployed();
      
      campaignFactory = await CampaignFactoryArtifact.deploy(dexLockerFactory.address);
      await campaignFactory.deployed();
      console.log('Using Campaign List Deployed at  ', campaignFactory.address );

      

      // console.log('Using Campaign Deployed at  ', campaign.address );
      
  });


  it("Should create new campaign", async function () {
    const [owner] = await ethers.getSigners();
    const createCampaignTx = await campaignFactory.createNewCampaign(token.address,
        [
          ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),
          ethers.utils.formatUnits( ethers.utils.parseEther("0.2"), 'wei'), 
          Math.floor(thirtySecondsTime/1000),//  Math.floor(new Date().getTime() / 1000) , // twoHoursTime, thirtySecondsTime
          Math.floor(thirtyDaysLater/1000), 
          ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),
          ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),
          ethers.utils.formatUnits( ethers.utils.parseEther("1"), 'wei'),
          ethers.utils.formatUnits( ethers.utils.parseEther("1"), 'wei'),
          '0'
        ] 
          ,0,router,[6000,30, 1000,800],
        //founderinfo
        //[formData.logo,'',formData.website, formData.twitter, formData.telegram, formData.discord ]
        ['https://place-hold.it/110','dsec', 'https://testtoken.org','https://twitter.com/test','https://testtoken.org', 'http://discord.me'],
          //teamtokenvesting
          [
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.05"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.05"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false}
        ],
        [
          {releaseDate: fourHoursLater, releaseAmount:  ethers.utils.parseEther("0.02"), hasBeenClaimed: false}, //25% of 0.08 being raisedfunds - raisedfundsUsedForLiquidity
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false}
        ], 
          
          {  
            value: ethers.utils.parseEther("0.0001") 
          });
    let txResult =   await createCampaignTx.wait();
    // campaignAddress = txResult.events[2].args['createdCampaignAddress'];
    campaignAddress = txResult.events.filter((f: any)=>f.event=='CampaignCreated')[0].args['createdCampaignAddress'];
    // console.log('Create Campaign Res: ', txResult );

    expect(await campaignFactory.campaignSize()).to.equal(1);
  });

  
  

  it('updates  contract details successfully', async() => {

    
    let error;
    try{
      const [owner] = await ethers.getSigners();
      let cmp = CampaignArtifact.attach(campaignAddress);
      
      const updateCampaignTx = await cmp.updateCampaignDetails('logourl', 'desc', 'websiteurl','twitter','telegram');
        
      let txResult =   await updateCampaignTx.wait();
      // console.log('Update Campaign List Res: ', txResult );
      expect(txResult.status).to.equal(1);
      
      
    }catch(err){
      
      
      error=err;
    }
    expect(error).to.equal(undefined);
    
    

  });

  it('campaignlist sould return correct campaign address for token address', async() => {
        const returnedAddress = await campaignFactory.tryGetCampaignByTokenAddress(token.address);
        expect(returnedAddress).to.equal(campaignAddress);
  });

  it('stops duplicates contract for the same token except when cancelled', async() => {

      
      let createError;
      try{
        const createCampaignTx = await campaignFactory.createNewCampaign(token.address,
        [ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),ethers.utils.formatUnits( ethers.utils.parseEther("0.2"), 'wei'), twoHoursTime, fourHoursLater, ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),
          ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),
          ethers.utils.formatUnits( ethers.utils.parseEther("1"), 'wei'),
          ethers.utils.formatUnits( ethers.utils.parseEther("1"), 'wei')
        ] 
          ,0,router,[6000,30, 1000,800],
          [
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.05"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.05"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false}
        ],
        [
          {releaseDate: fourHoursLater, releaseAmount:  ethers.utils.parseEther("0.02"), hasBeenClaimed: false}, //25% of 0.08 being raisedfunds - raisedfundsUsedForLiquidity
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: ethers.utils.parseEther("0.02"), hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
          {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false}
        ], 
          
          {  
            value: ethers.utils.parseEther("1.0") 
          });

        let txResult =   await createCampaignTx.wait();
         
      }catch(err){
        // console.error('Error duplicating: ', err);
        
        createError=err;
      }
      expect(createError).to.not.equal(undefined);
      expect(await campaignFactory.campaignSize()).to.equal(1);
      

  });

  it('submits initial token to contract successfully', async() => {

    
    let error;
    try{

      const [owner] = await ethers.getSigners();
      let cmp = CampaignArtifact.attach(campaignAddress);

      let campaignStatus = await cmp.getCampaignStatus();
      console.log('campaignStatus at start :', campaignStatus)

      let vestingTokens = await cmp.totalTokensExpectedToBeLocked();
      console.log(' vestingTokens:', vestingTokens.toString(), ', decimal: ', await token.decimals())

      // Arrpove contract with correct allowance
      
      let txAllowance = await token.approve(cmp.address, vestingTokens);
      await txAllowance.wait();
      
      const transferTokenTx = await cmp.transferTokens();        
      let txResult =   await transferTokenTx.wait();

      console.log('owner balance after:', (await token.balanceOf(owner.address)).toString())
      console.log('campaign balance after:', (await token.balanceOf(cmp.address)).toString())

      console.log('txResult.status:', txResult.status)
      expect(txResult.status).to.equal(1);

      campaignStatus = await cmp.getCampaignStatus();
      console.log('campaignStatus after:', campaignStatus)
      expect(campaignStatus).to.equal(1);

    }catch(err){
      
      console.error(err)
      error=err;
    }
    expect(error).to.equal(undefined);
    
    

  });

  it('accepts bids succesfully', async() => {

    
    let error;
    try{
      this.timeout(5000)
      const [owner, newSigner] = await ethers.getSigners();
      let cmp = CampaignArtifact.attach(campaignAddress);
      
      const tx = {
        from: newSigner.address,
        to: campaignAddress,
        value: ethers.utils.parseEther('0.10') // utils.formatUnits( utils.parseEther(amount.toString()), 'wei')
      };

      const txRes = await newSigner.sendTransaction(tx);
      let result = await txRes.wait();

      console.log('bid txResult.status:', result.status)

      // let balance = await newSigner.getBalance(newSigner.address);
      // // console.log(newSigner.address + ':' + ethers.utils.formatEther(balance));
      // console.log(newSigner.address + ':' + balance);

      // // console.log('campaign balance after:', (await cmp.balance()).toString())
      
      expect(result.status).to.equal(1);

    }catch(err){
      
      console.error(err)
      error=err;
    }
    expect(error).to.equal(undefined);
    
    

  });


});

