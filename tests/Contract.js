const { expect } = require("chai");

describe("Test my Contract", function () {
  let owner, contract;

  before(async function () {
    this.accounts = await ethers.getSigners();
    owner = await this.accounts[0].getAddress();

    this.Contract = await ethers.getContractFactory("Contract");
    this.contract = await this.Contract.deploy();
    await this.contract.deployed();
    contract = this.contract;
  });

  beforeEach(async function () {
    // Nothing specific to do, yet.
  });

  it("Check contract info", async function () {
    let texts = await contract.getValues(owner);
    expect(texts.length).to.equal(0);
  });

  it("Write a new value as owner", async function () {
    let i = await this.contract.writeValue("Hola", { from: owner });
    await i.wait();
    expect(i.value.toString()).to.equal("0");
  });

  it("Check new value from owner exists", async function () {
    let texts = await contract.getValues(owner);
    expect(texts.length).to.equal(1);
  });
});
