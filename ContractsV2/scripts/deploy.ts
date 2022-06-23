// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');


  

  
  const CampaignFactoryArtifact = await ethers.getContractFactory("CampaignList");
  const TokenArtifact = await ethers.getContractFactory("Token");
  const CampaignArtifact = await ethers.getContractFactory("Campaign");
  const DexLockerFactoryArtifact = await ethers.getContractFactory("DexLockerFactory");
  const DexLockerArtifact = await ethers.getContractFactory("DexLocker");
  const CoinVestingVaultArtifact = await ethers.getContractFactory("CoinVestingVault");



  //Deploy Clone Bases
  let campaignImplementation = await CampaignArtifact.deploy();
  await campaignImplementation.deployed();
  console.log('Campaign Implemntation Deployed at  ', campaignImplementation.address );

  let dexLockerImplementation = await DexLockerArtifact.deploy();
  await dexLockerImplementation.deployed();
  console.log('dexLocker Implemntation Deployed at  ', dexLockerImplementation.address );

  let coinVault = await CoinVestingVaultArtifact.deploy();
  await coinVault.deployed();
  console.log('coinVesting Implemntation Deployed at  ', coinVault.address );

  

  let token = await TokenArtifact.deploy();
  await token.deployed();
  console.log('Token Deployed at  ', token.address );

  let token2 = await TokenArtifact.deploy();
  await token2.deployed();
  console.log('Token2 Deployed at  ', token2.address );

  // let token3 = await TokenArtifact.deploy();
  // await token3.deployed();
  // console.log('Token3 Deployed at  ', token3.address );

  const dexLockerFactory = await DexLockerFactoryArtifact.deploy(dexLockerImplementation.address, coinVault.address );
  await dexLockerFactory.deployed();
  
  let campaignFactory = await CampaignFactoryArtifact.deploy(dexLockerFactory.address, campaignImplementation.address);
  await campaignFactory.deployed();
  console.log('Campaign List Deployed at  ', campaignFactory.address );


  // const ConfirmAddressArtifact = await ethers.getContractFactory("ConfirmAddress");
  // let confirmAddContract = await ConfirmAddressArtifact.deploy();
  // await confirmAddContract.deployed();
  // console.log('Confirm Address Deployed at  ', confirmAddContract.address );

  // let addToCheck = campaignFactory.address;
  // console.log('Confirming Address   ',addToCheck, ' is a contract address ', await confirmAddContract.isContract(addToCheck));

  // addToCheck = '0x4ABda0097D7545dE58608F7E36e0C1cac68b4943';
  // console.log('Confirming Address   ',addToCheck, ' is not a contract address ', !await confirmAddContract.isContract(addToCheck));
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
