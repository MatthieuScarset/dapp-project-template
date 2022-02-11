import { Messenger } from "./messenger.js";

class Wallet {
  constructor(domElement, localStorage = null) {
    this.element = domElement;
    this.messenger = new Messenger("#messages");
    this.address = undefined;
  }

  initialize = async () => {
    const { ethereum } = window;

    // Hide button.
    if (!Boolean(ethereum)) {
      this.element.disabled = true;
      this.element.classList.add('hidden');
      return;
    }

    // Attach click event.
    this.element.addEventListener("click", this.connect, true);

    await this.connect();
  };

  // Utility.
  connect = async () => {
    this.element.disabled = true;

    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        this.address = accounts[0];
        this.element.innerHTML = this.address;
        this.element.classList.add('tooltip');
        this.element.classList.remove('cursor-pointer');
        this.element.removeEventListener("click", this.connect);
        this.element.addEventListener("click", this.copy, true);
        this.messenger.new('To sign out from this dapp, open your wallet application and remove this page from your permissions', 1);
      })
      .catch((error) => {
        this.messenger.error(error.code + " " + error.message, true);
        this.address = null;
      })
      .finally(() => {
        this.element.disabled = false;
      });
  };

  copy = () => {
    navigator.clipboard.writeText(this.address);
    this.messenger.new('Address copied in clipboard!', 1)
  }
}

export { Wallet };
