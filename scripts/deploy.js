async function main() {
  const Contract = await ethers.getContractFactory("Contract");
  const _contract = await Contract.deploy();
  console.log("Contract deployed to address:", _contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
