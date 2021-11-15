const CampaignFactory = artifacts.require("CampaignFactory");
const Token = artifacts.require("Token");

module.exports = function (deployer) {
  deployer.deploy(Token);
  deployer.deploy(CampaignFactory);
}