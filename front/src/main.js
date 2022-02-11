import { App } from "./modules/app.js";
import config from "./modules/config.js";
import { Contract } from "./modules/contract.js";
import { Messenger } from "./modules/messenger.js";
import { Wallet } from "./modules/wallet.js";

let wallet = null;
let messenger = null;
let contracts = [];

const { ethereum, localStorage } = window;

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

    messenger.error(message);

    // Stop now.
    return;
  }

  // Wallet.
  const walletButton = document.getElementById("walletButton");
  wallet = new Wallet(walletButton, localStorage);
  wallet.initialize();

  // Contracts.
  config.contracts.forEach(async (data) => {
    await fetch(data.path)
      .then((response) => response.json())
      .then((contractData) => {
        const contractParams = {
          chainId: config.network.id ?? 1,
          address: data.address ?? "0x0",
          abi: contractData.abi ?? [],
        };

        const contractDefinition = Object.freeze({
          ...contractData,
          ...contractParams,
        });

        let contract = new Contract(contractDefinition);
        contract.initialize();
        contracts.push(contract);
      })
      .then(() => {
        // Run custom application now.
        localStorage.setItem('contracts', contracts)
        const app = new App(messenger, wallet, contracts, localStorage);
        app.run();
      });
  });

};

window.addEventListener("DOMContentLoaded", initialize);
