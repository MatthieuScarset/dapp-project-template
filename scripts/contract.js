import { Messenger } from './messenger';

class Contract {
  constructor(definition) {
    this.definition = definition;
    this.name = definition.contractName;
    this.abi = definition.abi;
    this.address = Object.keys(definition.networks).pop().address;
    this.instance = undefined;
  }

  static fetch = async (name) => {
    try {
      return await fetch('/contracts/' + name + '.json')
        .then(response => response.json())
    } catch (e) {
      Messenger.error('Error fetching data for ' + name + ' contract:<br>' + e.message);
      return {};
    }
  }

  methods = () => {
    let methods = {};
    this.abi.filter((method) => method.type == 'function')
      .forEach(method => (methods[method.name] = method));
    return methods;
  }

  events = () => {
    let events = [];
    this.abi.filter((method) => method.type == 'event')
      .forEach(event => events[event.name] = event);
    return events;
  }

  doc = (type = 'devdoc', methodDefinition) => {
    let name = methodDefinition.name || 'unknown method';
    let inputs = methodDefinition.inputs || {};
    let paramTypes = [];
    Object.entries(inputs).forEach(input => paramTypes.push(input[1].type));
    let key = name + '(' + paramTypes.join(',') + ')';

    let doc = this.definition[type].methods[key] || {};
    return doc.details || '';
  }

  renderMethodForm = (methodDefinition) => {
    let name = methodDefinition.name || 'unknown method';
    let inputs = methodDefinition.inputs || [];

    let form = document.createElement('form');
    form.title = name + ' form';
    form.id = 'contract-' + this.name + '-form-' + name;
    form.tabIndex = 0;
    // Save method name for later use in submit.
    form.dataset.methodName = name;

    let title = document.createElement('h3');
    title.innerHTML = name;
    title.tabIndex = 0;
    form.appendChild(title);

    // Documentation.
    let block = document.createElement('details');
    let helpTexts = [];
    ['userdoc', 'devdoc'].forEach(type => {
      helpTexts.push(this.doc(type, methodDefinition));
    });
    let hasHelpTexts = helpTexts.filter(v => { return v.length }).length < 1;
    block.innerHTML = helpTexts.join('<hr>');
    block.classList.add('text-xs', (hasHelpTexts ? 'hidden' : 'visible'));
    form.appendChild(block);

    inputs.forEach(input => {
      let uniqueId = this.name + '-method-' + name + '-input-' + input.name;
      let label = document.createElement('label');
      label.htmlFor = uniqueId;
      label.innerHTML = input.name;
      label.tabIndex = 0;
      form.appendChild(label);

      let element = document.createElement('input');
      element.id = uniqueId;
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
    let { ethereum, web3 } = window;
    let accounts = ethereum.accounts ?? [];
    let selectedAddress = ethereum.selectedAddress ?? false;

    if (force || !this.instance) {
      // Build a new Web3 contract object, with default account.
      // @see https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
      this.instance = new window.web3.eth.Contract(this.abi, this.address, {
        'from': selectedAddress ?? accounts[0] ?? null,
      });
    }

    return this.instance;
  }

  call = async (method, data) => {
    console.log(method);
    // return await this.instance.methods[method](data).call();
  }

  send = async (method, data) => {
    return await this.instance.methods[method]();
  }

  // Events
  onMethodFormSubmit = async (event) => {
    let { BN } = window.web3.utils;

    event.preventDefault();

    Messenger.clear();

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
        value = new BN(pair[1]).toString();
      }
      overrides[pair[0]] = value;
    };

    let callData = { ...params, ...overrides };
    let msg = 'Calling <em>' + this.name + ' <b>' + methodName + '()</b></em>';
    Messenger.new(msg + '<br>' + JSON.stringify(callData));


    this.call(methodName, callData)
      .then(result => Messenger.new('Result:<br>' + result, 0, 2))
      .catch(error => Messenger.error('Error ' + error.code + ': ' + error.message));
  };

}

export { Contract };
