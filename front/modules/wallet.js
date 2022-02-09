import { Messenger } from "./messenger.js";

class Wallet {
  constructor(domElement, localStorage = null) {
    this.element = domElement;
    this.stateKey = "wallet";
    this.storage = localStorage || window.localStorage;
    this.status = Boolean(this.getAccount()) ? 1 : 0;
    this.messenger = new Messenger("#messages");
  }

  initialize = () => {
    const { ethereum } = window;

    if (!Boolean(ethereum)) {
      // Install wallet suggestion.
      let message = "";
      message += "<b>Missing Ethereum provider.</b>";
      message += "<br>";
      message += "Please install one provider such as ";
      message += '<a target="_blank" href="https://frame.sh/">Frame.sh</a>';
      message += " or ";
      message +=
        '<a target="_blank" href="https://metamask.io/">Metamask.io</a>';

      this.messenger.new(message);
      return FALSE;
    }

    // Attach click event.
    this.element.addEventListener("click", this.onClick, true);

    // Refresh button.
    this.element.disabled = !Boolean(ethereum);
    this.label();

    // Display message.
    let message = "";
    message += !Boolean(ethereum) ? "No wallet detected." : "";
    message += this.status == 0 ? "Not connected." : "";
    message += this.status == -1 ? "Disconnected." : "";
    message +=
      this.status == 1
        ? "Connected: " +
          "<br>" +
          '<code class="block p-2 bg-slate-800 text-white">' +
          this.getAccount() +
          "</code>"
        : "";

    this.messenger.new(message);
  };

  // Element.
  label = () => {
    this.element.innerHTML =
      this.status == -1
        ? "Reconnect"
        : this.status == 1
        ? "Disconnect"
        : "Connect";
  };

  // Utility.
  connect = async () => {
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        this.messenger.new("Wallet connected successfully");
        this.setAccount(accounts[0]);
        this.status = 1;
        this.label();
      })
      .catch((error) => {
        this.messenger.new(error.code + " " + error.message, 0);
        this.disconnect();
        this.label();
      });
  };

  disconnect = () => {
    this.messenger.new("Wallet disconnected");
    this.removeAccount();
    this.status = -1;
    this.label();
  };

  // State.
  getAccount = () => {
    return this.storage.getItem(this.stateKey);
  };

  setAccount = (value) => {
    this.storage.setItem(this.stateKey, value);
  };

  removeAccount = () => {
    this.storage.removeItem(this.stateKey);
  };

  // Events.
  onClick = () => {
    this.element.disabled = true;

    if (this.status === 1) {
      // Disconnect.
      this.element.innerText = "Disconnecting...";
      this.disconnect();
    } else {
      // Try to connect.
      this.element.innerText = "Loading...";
      this.connect();
    }

    this.element.disabled = false;
  };
}

export { Wallet };
