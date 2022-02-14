import { Messenger } from './messenger.js';
import { Wallet } from './wallet.js';

// Start application.
async function main(callback) {
  if (!Boolean(window.ethereum)) {
    return Messenger.error('No ethereum provider found.' +
      '<br>' +
      'Please consider using one extension such as:' +
      '<br>' +
      '<a href="" target="_blank">Metamask</a>' +
      'or Frame.sh'
    );
  }

  const wallet = new Wallet();
}

window.addEventListener('load', main(), true);
