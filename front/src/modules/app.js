class App {
  constructor(messenger, wallet, contracts, localStorage) {
    this.messenger = messenger;
    this.wallet = wallet;
    this.contracts = contracts;
    this.storage = localStorage;
  }

  run = async () => {
    this.messenger.new("Application is ready, enjoy!");
  };
}

export { App };
