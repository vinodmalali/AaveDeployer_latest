const { ethers, run } = require("hardhat");

require("dotenv").config({ path: ".env" });

const {getValueByKey, writeToFile} = require('../helper/readAndWriteContractAddress');

async function deployer(args, keyName) {

    let DefaultReserveInterestRateStrategy = await ethers.getContractFactory("DefaultReserveInterestRateStrategy");

    const defaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(...args);

    const transaction = await defaultReserveInterestRateStrategy.deployed();

    console.log("defaultReserveInterestRateStrategy deployed to:", defaultReserveInterestRateStrategy.address);
    
    const newData = {[`${keyName}InterestRateStrategy`]: defaultReserveInterestRateStrategy.address};

    await writeToFile(newData);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // // Verify the contract after deploying
    // await run("verify", {
    //     address: defaultReserveInterestRateStrategy.address,
    //     constructorArgument: args,
    // });
}

module.exports.deployInterestRateStrategy = async function (){

    const providerAddr = await getValueByKey('LendingPoolAddressProvider');

    // provider followed by 1's
    let argsDAI = [providerAddr, "800000000000000000000000000", "0", "40000000000000000000000000", "750000000000000000000000000", "20000000000000000000000000", "750000000000000000000000000"];

    let argsUNI = [providerAddr, "650000000000000000000000000", "0", "80000000000000000000000000", "3000000000000000000000000000", "100000000000000000000000000", "3000000000000000000000000000"];

    await deployer(argsDAI, 'DAI');

    await deployer(argsUNI, 'UNI');

}

// // Call the main function and catch if there is any error
// deployInterestRateStrategy()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });














