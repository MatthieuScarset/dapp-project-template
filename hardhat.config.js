/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

const { API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY, NETWORK } = process.env;

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: `${NETWORK}`,
  networks: {
    hardhat: {},
    [`${NETWORK}`]: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: `${ETHERSCAN_API_KEY}`,
  },
};

/**
 * Get the list of accounts from Hardhat environment.
 *
 * @param array taskArgs
 *   A list of arguments.
 * @param object hre
 *   The Hardhard runtime environment.
 */
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
