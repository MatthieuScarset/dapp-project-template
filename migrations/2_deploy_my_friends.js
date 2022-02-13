const MyFriends = artifacts.require("MyFriends");

module.exports = function (deployer) {
  deployer.deploy(MyFriends);
};
