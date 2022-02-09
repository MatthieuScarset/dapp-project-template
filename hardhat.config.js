/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

const {
  NETWORK_CHAIN,
  NETWORK_API_URL,
  NETWORK_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  CONTRACT_ADDRESS,
} = process.env;

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: NETWORK_CHAIN,
  networks: {
    hardhat: {},
    [NETWORK_CHAIN]: {
      url: NETWORK_API_URL,
      accounts: [`0x${NETWORK_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  contract: {
    address: CONTRACT_ADDRESS,
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

/**
 * Deploy the contract.
 */
task("contract:deploy", "Deploying contract", async (taskArgs, hre) => {
  const Contract = await ethers.getContractFactory("Contract");
  const _contract = await Contract.deploy();
  console.log("Contract deployed to address:", _contract.address);
  console.log("Copy/paste this address into .env file.");
  console.log("Then, run `yarn run verify` to verify the contract.");
});

/**
 * Verify the contract.
 */
task("contract:verify", "Verifying contract", async (taskArgs, hre) => {
  const result = await hre.run("verify:verify", {
    address: `${CONTRACT_ADDRESS}`,
    constructorArguments: [],
  });
  console.log("Contract verification:", result);
});
