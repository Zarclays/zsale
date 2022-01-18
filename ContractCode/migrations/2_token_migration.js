
const Token = artifacts.require("Token");
const Token2 = artifacts.require("Token2");

module.exports = function (deployer) {
  deployer.deploy(Token);
  deployer.deploy(Token2, 'Tront', 'TRT');
  
}