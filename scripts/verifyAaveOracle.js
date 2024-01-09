const { ethers, run } = require("hardhat");

require("dotenv").config({ path: ".env" });

const { getValueByKey, writeToFile } = require('../helper/readAndWriteContractAddress');

module.exports.deployAaveOracle = async function () {

  const assetDAI = await getValueByKey('dai');

  const assetUNI = await getValueByKey('uni');

  const source = '0x0000000000000000000000000000000000000000';

  const fallbackOracle = await getValueByKey('PriceOracle');

  const baseCurrencyToken = await getValueByKey('wMATIC');

  const baseCurrencyUnit = '18';

  let args = [
    [assetDAI, assetUNI],
    [source, source],
    fallbackOracle,
    baseCurrencyToken,
    baseCurrencyUnit
  ];

  // Deploy LendingPoolAddressProviderRegistery contract
  const AaveOracleFactory = await ethers.getContractFactory("AaveOracle");

  const AaveOracleFactoryAddr = await AaveOracleFactory.deploy(...args);

  const transaction = await AaveOracleFactoryAddr.deployed();

  console.log("AaveOracle deployed to:", AaveOracleFactoryAddr.address);

  const newData = {"AaveOracle": AaveOracleFactoryAddr.address};

  await writeToFile(newData);

  // Wait for 5 confirmations
  await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

  // //Verify the contract after deploying
  // await run("verify", {
  //   address: AaveOracleFactoryAddr.address,
  //   constructorArgument: args.flat(), // Update this if your constructor takes arguments
  // });
}

// // Call the main function and catch if there is any error
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });




