import { Messenger } from './messenger';

class Contract {
  constructor(name, definition, address) {
    this.name = name;
    this.definition = definition;
    this.abi = definition.abi ?? [];

    // Get address from JSON, if not provided.
    let _list = definition.networks;
    let _last_event = Object.keys(_list).pop();
    this.address = address ?? _list[_last_event].address;

    this.instance = undefined;
  }

  static fetch = async (name) => {
    try {
      return await fetch('/contracts/' + name + '.json')
        .then(response => response.json());
    } catch (e) {
      Messenger.error('Error fetching data for ' + name + ' contract:<br>' + e.message);
      return {};
    }
  }

  methods = () => {
    return this.abi.filter((method) => method.type == 'function');
  }

  methodForm = (method) => {
    let form = document.createElement('form');
    form.title = method.name + ' form';
    form.id = 'contract-' + this.name + '-form-' + method.name;
    form.tabIndex = 0;
    form.dataset.methodName = method.name;

    let title = document.createElement('h3');
    title.innerHTML = method.name;
    title.tabIndex = 0;
    form.appendChild(title);

    if (method.inputs.length < 1) {
      let text = document.createElement('p');
      text.innerHTML = 'No inputs';
      form.appendChild(text);
    }

    method.inputs.forEach(input => {
      let label = document.createElement('label');
      label.htmlFor = this.name + '-input-' + input.name;
      label.innerHTML = input.name;
      label.tabIndex = 0;
      form.appendChild(label);

      let element = document.createElement('input');
      element.id = this.name + '-input-' + input.name;
      element.name = input.name;
      element.placeholder = input.type;
      form.appendChild(element);
    });

    let submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'Submit';
    submit.id = this.name + '-submit';
    form.appendChild(submit);

    // Take over submit.
    form.addEventListener("submit", this.onMethodFormSubmit);

    return form;
  }

  init = (force = false) => {
    if (force || !this.instance) {
      // Build a new Web3 contract object, with default account.
      // @see https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
      this.instance = new window.web3.eth.Contract(this.abi, this.address, {
        'from': window.ethereum.selectedAddress ?? window.ethereum.accounts[0] ?? null,
      });
    }

    return this.instance;
  }

  call = async (method, data) => {
    return await this.instance[method](data);
  }

  // Events
  onMethodFormSubmit = async (event) => {
    event.preventDefault();

    this.messenger.clear();

    let methodForm = event.target;
    let methodName = methodForm.dataset.methodName;
    let formData = new FormData(methodForm);

    let args = {};
    let params = [];
    for (var pair of formData.entries()) {
      args[pair[0]] = pair[1];
      params.push(pair[1]);
    }

    // Allow custom TX overrides.
    let txParamsForm = document.getElementById('tx-overrides-form');
    let txParamsData = new FormData(txParamsForm);
    let overrides = {}
    for (var pair of txParamsData.entries()) {
      let value = pair[1];
      if (value.length < 1) { continue; }
      if (parseInt(pair[1])) {
        value = ethers.BigNumber.from(pair[1]).toString();
      }

      console.log(value);

      overrides[pair[0]] = value;
    };

    await this.instance[methodName](...params, overrides)
      .finally(() => {
        let msg = 'Called <code>' + methodName + '</code> with:<br>' +
          'Args: <pre>' + JSON.stringify(args) + '</pre>' +
          'Overrides: <pre>' + JSON.stringify(overrides) + '</pre>'
        this.messenger.new(msg);
      })
      .then(result => this.messenger.new('Result:<br>' + result, 0, 2))
      .catch(error => this.messenger.error('Error ' + error.code + ': ' + error.message));
  };

}

export { Contract };
