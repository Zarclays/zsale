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

  // We get the contract to deploy
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);



  const CampaignFactoryArtifact = await ethers.getContractFactory("CampaignList");
  const TokenArtifact = await ethers.getContractFactory("Token");
  const CampaignArtifact = await ethers.getContractFactory("Campaign");
  const DexLockerFactoryArtifact = await ethers.getContractFactory("DexLockerFactory");


  let token = await TokenArtifact.deploy();
  await token.deployed();
  console.log('Token Deployed at  ', token.address );

  let token2 = await TokenArtifact.deploy();
  await token2.deployed();
  console.log('Token2 Deployed at  ', token2.address );

  let token3 = await TokenArtifact.deploy();
  await token3.deployed();
  console.log('Token3 Deployed at  ', token3.address );

  const dexLockerFactory = await DexLockerFactoryArtifact.deploy();
  await dexLockerFactory.deployed();
  
  let campaignFactory = await CampaignFactoryArtifact.deploy(dexLockerFactory.address);
  await campaignFactory.deployed();
  console.log('Campaign List Deployed at  ', campaignFactory.address );



  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
