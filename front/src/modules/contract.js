import { ethers } from "../../lib/ethers.js";
import { Messenger } from "./messenger.js";

class Contract {
  constructor(values) {
    this.instance = null;
    this.definition = values;
    this.name = values.contractName || "unknown";
    this.address = values.address || "0x0";
    this.abi = values.abi || [];
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    // @todo Use wallet?
    // const signer = new ethers.providers.Web3Signer();
    this.messenger = new Messenger("#messages");
  }

  initialize = async () => {
    this.instance = new ethers.Contract(this.address, this.abi, this.provider);

    await this.instance
      .deployed()
      .then(() => {
        this.instance.owner()
          .then((owner) => {
            let message = "";
            message += "Connected contract: ";
            message += "<br>";
            message += '<code class="block p-2 bg-slate-800 text-white">' + this.address + "</code>";
            message += "Owner by: ";
            message += "<br>";
            message += '<code class="block p-2 bg-slate-800 text-white">' + owner + "</code>";

            this.messenger.new(message, true);
          })
      })
      .catch((error) => messenger.error(error, true));
  };

  get = (key) => {
    return this.definition[key] || null;
  };

  methods = () => {
    return this.abi.filter((method) => method.type == 'function');
  }

  renderMethodForm = (method) => {
    let form = document.createElement('form');
    form.title = method.name + ' form';
    form.id = 'contract-' + this.name + '-form-' + method.name;
    form.tabIndex = 0;
    form.dataset.methodName = method.name;
    form.classList.add('mt-2', 'mb-2', 'p-2', 'border-2', 'bg-gray-200');

    form.innerHTML = method.inputs.length < 1 ? 'No inputs' : '';
    method.inputs.forEach(input => {
      let label = document.createElement('label');
      let element = document.createElement('input');

      label.htmlFor = this.name + '-input-' + input.name;
      label.innerHTML = input.name;
      label.classList.add('block', 'w-full', 'cursor-pointer');

      element.id = this.name + '-input-' + input.name;
      element.name = input.name;
      element.placeholder = input.type;
      element.classList.add('block', 'w-full', 'border-2', 'p-1');

      form.appendChild(label);
      form.appendChild(element);
    });

    let submit = document.createElement('input');

    submit.type = 'submit';
    submit.value = 'Submit';
    submit.id = this.name + '-submit';
    submit.classList.add('block', 'mt-2', 'mb-1', 'p-1', 'rounded-md',
      'text-sm', 'text-center', 'border-2', 'cursor-pointer', 'bg-teal-400', 'hover:bg-teal-600');

    form.appendChild(submit);

    // Take over submit.
    form.addEventListener("submit", this.onMethodFormSubmit);

    return form;
  }

  renderForms = () => {
    let details = document.createElement('details');
    details.id = 'contract-' + this.name;
    details.title = this.name;
    details.open = true;
    details.classList.add('p-2', 'border-2');

    let summary = document.createElement('summary');
    summary.innerHTML = this.name;
    summary.classList.add('font-bold', 'text-2xl', 'cursor-pointer');

    let list = document.createElement('div');
    list.classList.add('flex', 'flex-wrap', 'items-start');

    // Method form.
    this.methods().forEach(method => {
      let form = this.renderMethodForm(method);

      let item = document.createElement('div');
      let title = document.createElement('h3');
      let description = document.createElement('p');

      item.classList.add('flex-auto', 'w-1/2', 'p-2');

      title.classList.add('font-bold', 'text-lg');
      title.innerHTML = method.name;
      title.tabIndex = 0;

      description.classList.add('flex', 'items-center', 'justify-between', 'text-xs');
      description.tabIndex = 0;
      description.innerHTML = "";
      description.innerHTML += '<span class="flex-1 italic">' + method.stateMutability + '</span>';
      description.innerHTML += '<span class="flex flex-row items-center">';
      description.innerHTML += (method.outputs.length < 1 ? "void" : '');
      method.outputs.forEach(output => {
        description.innerHTML += '<span class="bg-gray-200 p-0.5">' +
          [output.name, output.type].filter(word => word.length > 0).join(': ') +
          "</span>";
      });
      description.innerHTML += "</span>";

      item.appendChild(title);
      item.appendChild(description);
      item.appendChild(form);

      list.appendChild(item);
    });

    details.appendChild(summary);
    details.appendChild(list);
    return details;
  };

  // Call a deployed contract's method.
  // @see https://docs.ethers.io/v5/api/contract/example/#erc20-meta-methods
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
