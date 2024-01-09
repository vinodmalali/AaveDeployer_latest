const { ethers, run } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {

    let args = [];

    // Deploy LendingPoolAddressProvider contract
    let VariableDebtToken = await ethers.getContractFactory("VariableDebtToken");
    const variableDebtToken = await VariableDebtToken.deploy(...args);

    const transaction = await variableDebtToken.deployed();
    console.log("variableDebtToken deployed to:", variableDebtToken.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // Verify the contract after deploying
    await run("verify", {
        address: variableDebtToken.address,
        constructorArgument: args,
    });
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });














