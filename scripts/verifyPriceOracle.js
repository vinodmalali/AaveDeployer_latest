const { ethers, run } = require("hardhat");

require("dotenv").config({ path: ".env" });

const {writeToFile, getValueByKey} = require('../helper/readAndWriteContractAddress');

module.exports.deployPriceOracle = async function () {

    let args = [];

    let PriceOracle = await ethers.getContractFactory("PriceOracle");

    const priceOracle = await PriceOracle.deploy(...args);

    const transaction = await priceOracle.deployed();

    console.log("Price Oracle deployed to:", priceOracle.address);

    const newData = {"PriceOracle": priceOracle.address};

    await writeToFile(newData);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // // Verify the contract after deploying
    // await run("verify", {
    //     address: priceOracle.address,
    //     constructorArgument: args,
    // });
}

// // Call the main function and catch if there is any error
// deployPriceOracle()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });














