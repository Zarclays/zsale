var TokenExample = artifacts.reqiure("./TokenExample.sol");
var CampaignSale = artifacts.require("./CampaignSale.sol");

module.export = function(deplyer){
    deployer.deploy(TokenExample, 1000000000000000000).then(function(){
        return deployer.deploy(CampaignSale, TokenExample.address);
    });
    
}