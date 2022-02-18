import { Messenger } from './messenger';

class Contract {
  constructor(definition) {
    this.definition = definition;
    this.name = definition.contractName;
    this.abi = definition.abi;

    let lastEvent = Object.keys(definition.networks).pop();
    this.address = definition.networks[lastEvent].address;

    this.instance = this.init();
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

    let buttons = { 'send': 'send', 'call': 'call', 'gas': 'estimateGas', 'encode': 'encodeABI' };
    if (methodDefinition.stateMutability === 'view') {
      delete buttons.send;
    }

    let actions = document.createElement('div');
    actions.classList.add('flex', 'items-center', 'space-between');
    Object.entries(buttons).forEach(pair => {
      let submit = document.createElement('input');
      submit.type = 'submit';
      submit.value = pair[0];
      submit.id = this.name + '-' + name;
      submit.dataset.action = pair[1];

      actions.appendChild(submit);
    });
    form.appendChild(actions);

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
        from: selectedAddress ?? accounts[0] ?? null
      });
    }

    window.deployedContracts = window.deployedContracts || [];
    window.deployedContracts.push(this.instance);

    return this.instance;
  }

  // Events
  onMethodFormSubmit = async (event) => {
    let { BN } = window.web3.utils;

    event.preventDefault();

    Messenger.clearAll();

    let methodForm = event.target;
    let methodName = methodForm.dataset.methodName;
    let formData = new FormData(methodForm);

    let args = {};
    let params = [];
    // Get call parameters.
    for (var pair of formData.entries()) {
      args[pair[0]] = pair[1];
      params.push(pair[1]);
    }

    // Get custom transaction overrides, if set.
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

    try {
      // Prepare call with parameters.
      let fn = this.instance.methods[methodName](...params);
      let action = event.submitter.dataset.action || null;

      // Display call details.
      let callData = { ...params, ...overrides };
      let msg = 'Call <em><b>' + this.name + '.' + methodName + '().' + action + '()</b></em > ';
      if (Object.keys(callData).length) {
        msg += ' with params:' + '<br>' + '<code>' + JSON.stringify(callData) + '</code>';
      }
      Messenger.new(msg);

      switch (action) {
        case 'encodeABI':
          Messenger.new('Signature hash:<br><code>' + fn.encodeABI() + '</code>', 0, 2);
          break;
        case 'estimateGas':
          fn.estimateGas(overrides)
            .then(gasAmount => Messenger.new('Gas amount estimated:<br>' + gasAmount, 0, 2))
            .catch(error => Messenger.error('Error ' + error.code + ': ' + error.message, 0));
          break;
        case 'call':
          fn.call()
            .then(result => {
              let message = typeof (result) == 'object' ? JSON.stringify(result) : result;
              Messenger.new('Result:<br>' + message, 0, 2)
            })
            .catch(error => Messenger.error('Error ' + error.code + ': ' + error.message, 0));
          break;
        case 'send':
          fn.send(overrides)
            .on('transactionHash', hash => Messenger.new('TX hash:<br>' + hash, 0, 2))
            .on('receipt', receipt => Messenger.new('TX receipt:<br>' + JSON.stringify(receipt), 0, 2))
            .on('confirmation', (confirmationNumber, receipt) => Messenger.new('TX confirmation:<br>' + confirmationNumber + '<br>' + JSON.stringify(receipt), 0, 2))
            .on('error', (error, receipt) => Messenger.error('Error ' + error.code + ': ' + error.message + '<br>' + JSON.stringify(receipt), 0));
          break;
        default:
          console.log('Unknown action: ' + action);
          break;
      }

    } catch (error) {
      Messenger.error('Error ' + error.code + ': ' + error.message, 0);
    }

  }
}

export { Contract };
