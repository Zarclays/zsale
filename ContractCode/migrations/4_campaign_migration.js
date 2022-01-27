const CampaignList = artifacts.require("CampaignList");
const CampaignArtifact = artifacts.require("Campaign");

module.exports = async function (deployer, accounts) {
  

  let cl = await CampaignList.deployed();
  
  const now = new Date();
  const twoHoursTime = now.setHours(now.getHours()+2);
  const fourHoursLater = now.setHours(now.getHours()+4);
  const router = '0xeD37AEDD777B44d34621Fe5cb1CF594dc39C8192';
  await deployer.deploy(CampaignArtifact,cl.address, '0xcf936eeD40034dF12950A4aa9dFE46AF0b94e659',1,2, twoHoursTime, fourHoursLater,0,router,6000,1000,800,2, {  value: "1000000000000000" });

   
}