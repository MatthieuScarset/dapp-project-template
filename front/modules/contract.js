const { ethereum } = window;

class Contract {
  constructor(definition = {}, localStorage = null) {
    this.abi = definition.abi || [];
    this.storage = localStorage || window.localStorage;
  }

  initialize = () => {};

  getName = () => {
    return "A very smart contract";
  };
}

export { Contract };
