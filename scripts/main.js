import { Contract } from './contract';
import { Messenger } from './messenger';
import { Wallet } from './wallet';

const Web3 = require('../lib/web3.min.js');
const web3 = new Web3(Web3.givenProvider || window.ethereum || "ws://localhost:7545");

const contracts = ['MyFriends', 'MyNFT'];
const contractsWrapper = document.querySelector('#contracts');

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

  // Allow easy use of Web3 library from components.
  // @see Contracts::instance();
  window.web3 = web3;

  new Wallet();

  contracts.forEach(async (name) => {
    await Contract.fetch(name)
      .then(data => {
        let contract = new Contract(name, data);

        contract.init();

        let details = document.createElement('details');
        details.id = 'contract-' + name;
        details.title = name;
        details.open = true;
        details.classList.add('p-4', 'border-2');

        let summary = document.createElement('summary');
        summary.innerHTML = name;
        summary.classList.add('font-bold', 'text-2xl', 'cursor-pointer');

        let description = document.createElement('p');
        description.innerHTML = 'View <a class="underline" href="/contracts/' + name + '.json" target="_blank">full contract\'s details</a>.';
        description.classList.add('text-xs');

        let list = document.createElement('div');
        list.classList.add('flex', 'flex-wrap', 'items-stretch');

        // Build each methods' form.
        contract.methods().forEach(name => {
          let form = contract.methodForm(name);
          let titles = form.querySelectorAll('h3');
          let labels = form.querySelectorAll('label');
          let inputs = form.querySelectorAll('input:not([type="submit"]');
          let submits = form.querySelectorAll('input[type="submit"]');

          // Custom theming.
          form.classList.add('flex-1', 'basis-1/2', 'p-6', 'fake-bg');
          form.classList.add('md:max-w-1/2');
          titles.forEach(el => el.classList.add('font-bold'));
          labels.forEach(el => el.classList.add('block', 'w-full', 'cursor-pointer'));
          inputs.forEach(el => el.classList.add('block', 'w-full', 'border-2', 'p-1'));
          submits.forEach(el => el.classList.add('block', 'mt-2', 'mb-1', 'p-1', 'rounded-md', 'text-sm', 'text-center', 'border-2', 'cursor-pointer', 'bg-teal-400', 'hover:bg-teal-600'));

          list.appendChild(form);
        });

        details.appendChild(summary);
        details.appendChild(description);
        details.appendChild(list);
        contractsWrapper.appendChild(details);
      });
  });
}

window.addEventListener('load', main, true);
