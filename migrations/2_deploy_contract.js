const Contract = artifacts.require("Contract");
// const AnotherContract = artifacts.require("AnotherContract");

module.exports = function (deployer) {
  deployer.deploy(Contract);
  // deployer.deploy(AnotherContract);
};
