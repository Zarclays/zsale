import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  // it("Should return the new greeting once it's changed", async function () {
  //   const Greeter = await ethers.getContractFactory("Greeter");
  //   const greeter = await Greeter.deploy("Hello, world!");
  //   await greeter.deployed();

  //   expect(await greeter.greet()).to.equal("Hello, world!");

  //   const now = new Date();
  //   const twoHoursTime = now.setHours(now.getHours()+2);
  //   const fourHoursLater = now.setHours(now.getHours()+4);

  //   const setGreetingTx = await greeter.setGreeting("Hola, mundo!", [
  //         {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
  //         {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
  //         {releaseDate: fourHoursLater, releaseAmount: '500000000000000', hasBeenClaimed: false},
  //         {releaseDate: fourHoursLater, releaseAmount: '200000000000000', hasBeenClaimed: false},
  //         {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
  //         {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
  //         {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false},
  //         {releaseDate: fourHoursLater, releaseAmount: '0', hasBeenClaimed: false}
  //       ]);

  //   // wait until the transaction is mined
  //   await setGreetingTx.wait();

  //   expect(await greeter.greet()).to.equal("Hola, mundo!");

  //   // console.log('list: ',await greeter.listMember(1))
  // });

  it("Should check owner", async function () {
    const Greeter2 = await ethers.getContractFactory("Greeter2");
    const greeter2 = await Greeter2.deploy("Hello, world!");
    await greeter2.deployed();

    expect(await greeter2.greet()).to.equal("Hello, world!");

    

    // console.log('list: ',await greeter.listMember(1))
  });
});


// describe("CampaignList", function () {
  
//   const now = new Date();
//   const twoHoursTime = now.setHours(now.getHours()+2);
//   const fourHoursLater = now.setHours(now.getHours()+4);
//   let CampaignFactoryArtifact = undefined;
//   let TokenArtifact = undefined;
//   let CampaignArtifact = undefined;

//   const router = '0xeD37AEDD777B44d34621Fe5cb1CF594dc39C8192';
//   let  campaignFactory: any;
//   let campaign;
//   let  token: any;
  

//   before('Initialize and Deploy SmartContracts', async () => {
//       CampaignFactoryArtifact = await ethers.getContractFactory("CampaignList");
//       TokenArtifact = await ethers.getContractFactory("Token");
//       CampaignArtifact = await ethers.getContractFactory("Campaign");


//       token = await TokenArtifact.deploy();
//       await token.deployed();
      
//       campaignFactory = await CampaignFactoryArtifact.deploy();
//       await campaignFactory.deployed();
//       console.log('Using Campaign List Deployed at  ', campaignFactory.address );

      

//       // console.log('Using Campaign Deployed at  ', campaign.address );
      
//   });


//   it("Should create new campaign", async function () {
//     console.log('arr: ', [ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),ethers.utils.formatUnits( ethers.utils.parseEther("0.2"), 'wei'), twoHoursTime, fourHoursLater, ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),
//           ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),
//           ethers.utils.formatUnits( ethers.utils.parseEther("1"), 'wei'),
//           ethers.utils.formatUnits( ethers.utils.parseEther("1"), 'wei')
//         ] )
//     const createCampaignTx = await campaignFactory.createNewCampaign( token.address,
//         [ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),ethers.utils.formatUnits( ethers.utils.parseEther("0.2"), 'wei'), twoHoursTime, fourHoursLater, ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),
//           ethers.utils.formatUnits( ethers.utils.parseEther("0.1"), 'wei'),
//           ethers.utils.formatUnits( ethers.utils.parseEther("1"), 'wei'),
//           ethers.utils.formatUnits( ethers.utils.parseEther("1"), 'wei')
//         ] 
//           ,0,router,6000,1000,800,ethers.utils.formatUnits( ethers.utils.parseEther("0.2"), 'wei'), {  value: ethers.utils.parseEther("1.0") }); // , {  value: ethers.utils.parseEther("1.0") }
//       await createCampaignTx.wait();

//     expect(await campaignFactory.campaignSize()).to.equal(1);
//   });
// });

