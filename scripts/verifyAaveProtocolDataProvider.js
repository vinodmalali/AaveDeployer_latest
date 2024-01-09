const { ethers, run } = require("hardhat");
require("dotenv").config({ path: ".env" });
const {getValueByKey, writeToFile} = require('../helper/readAndWriteContractAddress');

module.exports.deployDataProvider = async function () {

    const providerAddr = await getValueByKey('LendingPoolAddressProvider');
    
    // provider address
    let args = [providerAddr];

    // Deploy LendingPoolAddressProvider contract
    let AaveProtocolDataProvider = await ethers.getContractFactory("AaveProtocolDataProvider");

    const aaveProtocolDataProvider = await AaveProtocolDataProvider.deploy(...args);

    const transaction = await aaveProtocolDataProvider.deployed();

    console.log("aaveProtocolDataProvider deployed to:", aaveProtocolDataProvider.address);

    const newData = {"AaveProtocolDataProvider": aaveProtocolDataProvider.address};

    await writeToFile(newData);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // // Verify the contract after deploying
    // await run("verify", {
    //     address: aaveProtocolDataProvider.address,
    //     constructorArgument: args,
    // });
}

// // Call the main function and catch if there is any error
// deployDataProvider()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });














