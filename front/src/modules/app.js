class App {
  constructor(messenger, wallet, contracts, localStorage) {
    this.messenger = messenger;
    this.wallet = wallet;
    this.contracts = contracts;
    this.storage = localStorage;
  }

  run = async () => {
    // Render default form to interact with your contract(s).
    let wrapper = document.getElementById('contracts')

    this.contracts.forEach(contract => {
      let name = contract.get('contractName').replace(' ', '-');
      let details = contract.renderForms();
      wrapper.appendChild(details);
    });
  };
}

export { App };
