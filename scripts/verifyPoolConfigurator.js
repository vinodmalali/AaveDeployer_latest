const { ethers, run } = require("hardhat");

require("dotenv").config({ path: ".env" });

const {writeToFile} = require('../helper/readAndWriteContractAddress');

module.exports.deployConfigurator = async function () {
  
  const LendingPoolConfigurator = await ethers.getContractFactory("LendingPoolConfigurator");

  const LendingPoolConfiguratorAddr = await LendingPoolConfigurator.deploy();

  const transaction = await LendingPoolConfiguratorAddr.deployed();

  console.log("LendingPoolConfigurator deployed to:", LendingPoolConfiguratorAddr.address);

  const newData = { "LendingPoolConfigurator": LendingPoolConfiguratorAddr.address };

  await writeToFile(newData);

  // Wait for 5 confirmations
  await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

  // //Verify the contract after deploying
  // await run("verify", {
  //   address: LendingPoolConfiguratorAddr.address,
  //   constructorArguments: [], // Update this if your constructor takes arguments
  // });
}

// // Call the main function and catch if there is any error
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
