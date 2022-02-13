const MyFriends = artifacts.require("MyFriends");

/*
 * Learn more about testing in JS:
 * @see https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("MyFriends", function (accounts) {
  let owner, instance;

  before(async function () {
    owner = accounts[0];

    await MyFriends.deployed()
      .then(contract => { instance = contract });
  });

  it("MyFriends was deployed", async function () {
    return expect(instance).to.be.a('object', 'Is there a migration file for this contract? (e.g. ./migrations/2_deploy_my_friends.js)');
  });

  it("MyFriends owner is correct", async function () {
    await instance.owner().then(address => {
      return assert.isTrue(address == owner, 'Owner and deployer address mismatch');
    });
  });

  // @todo Add more tests.
});
