const { ethers, run } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {

    let args = [];

    // Deploy LendingPoolAddressProvider contract
    let AToken = await ethers.getContractFactory("AToken");
    const aToken = await AToken.deploy(...args);

    const transaction = await aToken.deployed();
    console.log("aToken deployed to:", aToken.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // Verify the contract after deploying
    await run("verify", {
        address: aToken.address,
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














