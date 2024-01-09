const { ethers, run } = require("hardhat");

require("dotenv").config({ path: ".env" });

const {writeToFile, getValueByKey} = require('../helper/readAndWriteContractAddress');

module.exports.deployIncentiveController = async function deployIncentiveController() {

    const retrievedWMATIC = await getValueByKey("wMATIC");

    // reward token as WMATIC address and emission manager as wallet address
    let args = [retrievedWMATIC, process.env.WALLET];

    // Deploy LendingPoolAddressProvider contract
    let AaveIncentiveController = await ethers.getContractFactory("AaveIncentivesController");

    const aaveIncentiveController = await AaveIncentiveController.deploy(...args);

    const transaction = await aaveIncentiveController.deployed();

    console.log("AaveIncentiveController deployed to:", aaveIncentiveController.address);

    const newData = {"AaveIncentiveController": aaveIncentiveController.address};

    await writeToFile(newData);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // // Verify the contract after deploying
    // await run("verify", {
    //     address: aaveIncentiveController.address,
    //     constructorArgument: args,
    // });
}

// // Call the main function and catch if there is any error
// deployIncentiveController()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });
