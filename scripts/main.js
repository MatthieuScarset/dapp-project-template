import { Messenger } from './messenger.js';
import { Wallet } from './wallet.js';

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

  new Wallet();
}

window.addEventListener('load', main, true);
