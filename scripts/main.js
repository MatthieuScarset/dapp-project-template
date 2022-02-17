import { Contract } from './contract';
import { Messenger } from './messenger';
import { Wallet } from './wallet';

// Local copy of Web3 lib for convenience - not safe for production!
const Web3 = require('../lib/web3.min.js');

// Add/Remove your contracts' name here.
const contracts = ['MyFriends', 'MyNFT'];

// Start application.
async function main(callback) {
  new Messenger();

  if (!Boolean(window.ethereum)) {
    return Messenger.error('No ethereum provider found.' +
      '<br>' +
      'Please consider using one extension such as:' +
      '<br>' +
      '<a class="font-bold" style="text-decoration: underline" href="https://metamask.io/" target="_blank">Metamask</a>' + ' (most used) or ' +
      '<a class="font-bold" style="text-decoration: underline" href="https://frame.sh/" target="_blank">Frame</a>' + ' (most private)'
    );
  }

  // Refresh Web3 object for easier use within other components.
  window.web3 = new Web3(Web3.givenProvider || window.ethereum || "ws://localhost:7545");

  // Connect user.
  new Wallet();

  // Build contracts info.
  contracts.forEach(async (name) => {
    await Contract.fetch(name)
      // Instanciate our contract from the freshly fetched JSON file.
      .then(definition => new Contract(definition))
      // Render forms to play with our contract from frontend.
      .then(contract => renderContractForm(contract));
  });
}

// Helper function to customize UX.
function renderContractForm(contract = {}) {
  let list = document.createElement('div');
  list.classList.add('flex', 'flex-wrap', 'items-stretch');

  let methods = contract.methods();
  for (const [methodName, methodDefinition] of Object.entries(methods)) {
    // ===================================================
    // This is where magic happens.
    // ===================================================
    let form = contract.renderMethodForm(methodDefinition);

    // Custom theming
    let titles = form.querySelectorAll('h3');
    let labels = form.querySelectorAll('label');
    let inputs = form.querySelectorAll('input:not([type="submit"]');
    let submits = form.querySelectorAll('input[type="submit"]');

    form.classList.add('flex-1', 'basis-1/2', 'p-6', 'fake-bg');
    form.classList.add('md:max-w-1/2');
    titles.forEach(el => el.classList.add('font-bold'));
    labels.forEach(el => el.classList.add('block', 'w-full', 'cursor-pointer'));
    inputs.forEach(el => el.classList.add('block', 'w-full', 'border-2', 'p-1'));
    submits.forEach(el => el.classList.add('block', 'mt-2', 'mb-1', 'p-1', 'rounded-md', 'text-sm', 'text-center', 'border-2', 'cursor-pointer', 'bg-teal-400', 'hover:bg-teal-600'));

    list.appendChild(form);
  };

  // Custom elements for our frontend.
  let details = document.createElement('details');
  details.id = 'contract-' + contract.name;
  details.title = 'Toggle "' + contract.name + '.sol" contract\'s method forms';
  details.open = true;
  details.classList.add('p-4', 'border-2');

  let summary = document.createElement('summary');
  summary.innerHTML = contract.name;
  summary.classList.add('font-bold', 'text-2xl', 'cursor-pointer');

  let description = document.createElement('p');
  description.innerHTML = 'View <a class="underline" href="/contracts/' + contract.name + '.json" target="_blank">full contract\'s details</a>.';
  description.classList.add('text-xs');

  details.appendChild(summary);
  details.appendChild(description);
  details.appendChild(list);

  document.querySelector('#contracts').appendChild(details);
}

window.addEventListener('load', main, true);
