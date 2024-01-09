const { ethers, run } = require("hardhat");

require("dotenv").config({ path: ".env" });

const {writeToFile, getValueByKey} = require("../helper/readAndWriteContractAddress");

module.exports.deployTokenHelper = async function () {

    // proxy pool and provider
    const proxyPool = await getValueByKey('LendingPoolProxy');

    const providerAddr = await getValueByKey('LendingPoolAddressProvider');

    let args = [proxyPool, providerAddr];

    // Deploy LendingPoolAddressProvider contract
    let StableAndVariableTokensHelper = await ethers.getContractFactory("StableAndVariableTokensHelper");

    const stableAndVariableTokensHelper = await StableAndVariableTokensHelper.deploy(...args);

    const transaction = await stableAndVariableTokensHelper.deployed();
    console.log("stableAndVariableTokensHelper deployed to:", stableAndVariableTokensHelper.address);

    const newData = {"StableAndVariableTokenHelper": stableAndVariableTokensHelper.address};

    await writeToFile(newData);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // // Verify the contract after deploying
    // await run("verify", {
    //     address: stableAndVariableTokensHelper.address,
    //     constructorArgument: args,
    // });
}

// // Call the main function and catch if there is any error
// deployTokenHelper()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });














