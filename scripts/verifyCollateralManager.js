const { ethers, run } = require("hardhat");

require("dotenv").config({ path: ".env" });

const {writeToFile} = require('../helper/readAndWriteContractAddress');

module.exports.deployCollateralManager = async function () {

  const LendingPoolCollateralManagerAddr = await ethers.getContractFactory("LendingPoolCollateralManager");

  const LendingPoolCollateralManagerAddr1 = await LendingPoolCollateralManagerAddr.deploy();

  const transaction = await LendingPoolCollateralManagerAddr1.deployed();

  console.log("LendingPoolAddressProviderRegistery deployed to:", LendingPoolCollateralManagerAddr1.address);

  const newData = { "LendingPoolCollateralManager": LendingPoolCollateralManagerAddr1.address };

  await writeToFile(newData);

  // Wait for 5 confirmations
  await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

  // //Verify the contract after deploying
  // await run("verify", {
  //   address: LendingPoolCollateralManagerAddr1.address,
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
