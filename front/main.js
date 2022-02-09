import { Contract } from "./modules/contract.js";
import { Messenger } from "./modules/messenger.js";
import settings from "./modules/settings.js";
import { Wallet } from "./modules/wallet.js";

const storage = window.localStorage;
const env = settings.local ?? {};

const initialize = async () => {
  // Messages.
  const messageBoxes = document.getElementById("messages");
  const messenger = new Messenger(messageBoxes);
  messenger.initialize();

  // Wallet.
  const walletButton = document.getElementById("walletButton");
  const wallet = new Wallet(walletButton, storage);
  wallet.initialize();

  // Smart Contract - this is where the fun begins!
  const contractDefinition = {
    chainId: env.network.id ?? 1,
    address: env.contract.address ?? "0x0",
    abi: env.contract.abi ?? [],
  };
  const contract = new Contract(contractDefinition, storage);
  contract.initialize();

  // Update app title.
  let contractName = contract.getName();
  document.title = contractName;
  document.querySelectorAll(".contract-name").forEach((el) => {
    el.innerHTML = contractName;
  });
};

window.addEventListener("DOMContentLoaded", initialize);
