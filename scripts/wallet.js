import { Messenger } from "./messenger.js";

class Wallet {
  constructor() {
    this.account = false;
    this.btn = document.querySelector('#connect');
    this.label = this.btn.querySelector('.label');
    this.address = this.btn.querySelector('.address');
    this.btn.addEventListener('click', this.connect, true);

    // Register events.
    window.ethereum.on('accountsChanged', this.accountsChanged, true);
    window.ethereum.on('chainChanged', this.networkChanged, true);

    // Open wallet.
    this.connect();
  }

  getNetwork = async () => {
    let network = {};
    network.id = await window.web3.eth.net.getId().then(id => id);
    network.name = await window.web3.eth.net.getNetworkType().then(name => name);
    return network;
  }

  copy = () => {
    let address = this.address.innerHTML;
    if (address && address.length) {
      navigator.clipboard.writeText(address);
      Messenger.new('Address copied!', true);
    }
  }

  connect = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
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

        return account;
      })
      .catch(e => {
        switch (e.code) {
          case 4001:  // Wallet closed.
          case -32002: // Another request exists.
            Messenger.error("¯\\_(ツ)_/¯" + '<br>' + 'Can you open your wallet please?', true);
          default:
            // Fail silently.
            console.log(e.code, e.message);
            break;
        }
      })
      .finally(account => {
        this.account = account;

        if (account) {
          Messenger.new('Connected as: ' + account, true);
        }
      });
  }

  accountsChanged = async (accounts) => {
    Messenger.new('Account changed: ' + accounts[0]);
    Messenger.new('Reloading window to reflect changes...');
    setTimeout(() => { window.location.reload() }, 2500);
  }

  networkChanged = async (chainId) => {
    Messenger.new('Blockchain switched to: ' + chainId);
    Messenger.new('Reloading window to reflect changes...');
    setTimeout(() => { window.location.reload() }, 5000);
  }
}

export { Wallet };
