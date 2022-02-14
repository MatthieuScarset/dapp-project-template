import { Messenger } from "./messenger.js";

const { ethereum, web3 } = window;

class Wallet {
  constructor() {
    this.btn = document.querySelector('#connect');
    this.label = this.btn.querySelector('.label');
    this.address = this.btn.querySelector('.address');
    this.btn.addEventListener('click', this.connect, true);
    this.connect();

    ethereum.on('accountsChanged', this.accountsChanged, true);
    ethereum.on('chainChanged', this.networkChanged, true);
  }

  // Refresh Web3 object in window.
  // This way other components can get it, as follow:
  // const { web3 } = window;
  refresh = () => {
    try {
      window.web3 = new Web3(ethereum);
    } catch (e) {
      Messenger.error(e);
    }
  }

  copy = () => {
    let address = this.address.innerHTML;
    if (address && address.length) {
      navigator.clipboard.writeText(address);
      Messenger.new('Address copied!', true);
    }
  }

  connect = async () => {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          let account = accounts[0];

          if (!account) {
            this.label.classList.remove('hidden');
            this.address.classList.add('hidden');
            this.address.innerHTML = '';
            this.btn.removeEventListener('click', this.copy);
            this.btn.addEventListener('click', this.connect, true);
          }

          if (account) {
            this.label.classList.add('hidden');
            this.address.classList.remove('hidden');
            this.address.innerHTML = account;
            Messenger.new('Connected as:<br>' + account, true);
            this.btn.removeEventListener('click', this.connect, true);
            this.btn.addEventListener('click', this.copy);
          }
        });

    } catch (e) {
      Messenger.error(e.code + ': ' + e.message, true);
    }
  }

  accountsChanged = async (accounts) => {
    Messenger.new('Account changed: ' + accounts[0]);
    Messenger.new('Reloading window to reflect changes...');
    setTimeout(() => { window.location.reload() }, 2500);
  }

  networkChanged = async (chainId) => {
    console.log(chainId);
    Messenger.new('Blockchain switched to: ' + chainId);
    Messenger.new('Reloading window to reflect changes...');
    setTimeout(() => { window.location.reload() }, 5000);
  }
}

export { Wallet };
