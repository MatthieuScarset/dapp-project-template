/**
 * @type Interactively work with your smart contracts.
 *
 * Run this in your terminal:
 * `npx truffle exec --network <network_id> scripts/cmd.js`
 *
 * @see https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts.html
 */
const myContracts = ['MyFriends', 'MyNFT'];

module.exports = async function main(callback) {
  try {
      // Get deployed contract instance.
      // Don't forget to run `truffle migrate` before.
      const Contract = artifacts.require('MyFriends');
      const instance = await Contract.deployed();

      // Ex: check contract's owner.
      await instance.owner().then(address => console.log(address));

    myContracts.forEach((name) => {
    });

    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
};
