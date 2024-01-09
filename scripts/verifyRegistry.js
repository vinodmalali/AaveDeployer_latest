const { ethers, run } = require("hardhat");
require("dotenv").config({ path: ".env" });
const {writeToFile} = require('../helper/readAndWriteContractAddress');

module.exports.deployRegistry = async function () {
  // Deploy LendingPoolAddressProviderRegistery contract
  const LendingPoolAddressProviderRegistery = await ethers.getContractFactory("LendingPoolAddressesProviderRegistry");
  const lendingPoolAddressProviderRegistery = await LendingPoolAddressProviderRegistery.deploy();

  const transaction = await lendingPoolAddressProviderRegistery.deployed();
  console.log("LendingPoolAddressProviderRegistery deployed to:", lendingPoolAddressProviderRegistery.address);

  const newData = { "LendingPoolRegistry": lendingPoolAddressProviderRegistery.address };

  await writeToFile(newData);

  // Wait for 5 confirmations
  await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

  // Verify the contract after deploying
  // await run("verify", {
  //   address: lendingPoolAddressProviderRegistery.address,
  //   constructorArguments: [], // Update this if your constructor takes arguments
  // });
}

// Call the main function and catch if there is any error
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
