import { Contract } from "./modules/contract.js";
import { Messenger } from "./modules/messenger.js";
import settings from "./modules/settings.js";
import { Wallet } from "./modules/wallet.js";

const { ethereum, localStorage } = window;
const env = settings.local ?? {};

let wallet, messenger, contract;

// Global setup.
const initialize = async () => {
  // Messages.
  const messageBoxes = document.getElementById("messages");
  messenger = new Messenger(messageBoxes);
  messenger.initialize();

  if (!Boolean(ethereum)) {
    // Install wallet suggestion.
    let message = "";
    message += "<b>Missing Ethereum provider</b>";
    message += "<br>";
    message += "Please install one provider such as ";
    message += '<a target="_blank" href="https://frame.sh/">Frame.sh</a>';
    message += " or ";
    message += '<a target="_blank" href="https://metamask.io/">Metamask.io</a>';

    messenger.new(message, 0, false);

    // Stop now.
    return;
  }

  // Wallet.
  const walletButton = document.getElementById("walletButton");
  wallet = new Wallet(walletButton, localStorage);
  wallet.initialize();

  // Smart Contract.
  const contractArtifactPath = "./contracts/Contract.sol/Contract.json";
  const contractData = await fetch(contractArtifactPath)
    .then((response) => response.json())
    .then((contractData) => contractData);

  const contractParams = {
    chainId: env.network.id ?? 1,
    address: env.contract.address ?? "0x0",
    abi: contractData.abi ?? [],
  };

  const contractDefinition = Object.freeze({
    ...contractData,
    ...contractParams,
  });

  contract = new Contract(contractDefinition);
  contract.initialize();

  // Run custom application now.
  await main().then(() => {
    if (!localStorage.getItem("ready"))
      messenger.new("Application is ready, enjoy!");
  });
};

// Run the app.
const main = async () => {
  localStorage.setItem("ready", true);

  // Custom things go here.
  // ...
};

window.addEventListener("DOMContentLoaded", initialize);
