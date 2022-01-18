const Migrations = artifacts.require("Migration");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};