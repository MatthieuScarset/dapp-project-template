import { ethers } from "../../node_modules/ethers/dist/ethers.esm.min.js";
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
    let { address, abi } = this.definition;
    this.instance = new ethers.Contract(this.address, this.abi, this.provider);

    await this.instance
      .owner()
      .then((address) => {
        let message = "";
        message += "Connected contract: ";
        message += "<br>";
        message += '<code class="block p-2 bg-slate-800 text-white">';
        message += address;
        message += "</code>";

        this.messenger.new(message);
      })
      .catch((error) => messenger.new(error, 0, false));
  };

  get = (key) => {
    return this.definition[key] || null;
  };
}

export { Contract };
