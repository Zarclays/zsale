const CampaignList = artifacts.require("CampaignList");


module.exports = async function (deployer, accounts) {
  await deployer.deploy(CampaignList);
   
}