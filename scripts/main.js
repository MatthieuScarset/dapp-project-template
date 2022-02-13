import { ethers } from "../lib/web3.min.js";

async function main(callback) {
  // instantiate web3 and creating web3 connection
  // const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
  // window.web3 = web3;
  console.log(ethers);
}

window.addEventListener('load', async () => {
  await main();
})
