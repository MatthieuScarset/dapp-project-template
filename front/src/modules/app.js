class App {
  constructor(messenger, wallet, contracts, localStorage) {
    this.messenger = messenger;
    this.wallet = wallet;
    this.contracts = contracts;
    this.storage = localStorage;
  }

  run = async () => {
    console.log("hello");
    if (!this.storage.getItem("ready")) {
      this.messenger.new("Application is ready, enjoy!");
      this.storage.setItem("ready", true);
    }
  };
}

export { App };
