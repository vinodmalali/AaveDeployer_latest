const { ethers, run } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {

    // Deploy LendingPoolAddressProvider contract
    let WMATIC = await ethers.getContractFactory("WMATIC");
    const wMATIC = await WMATIC.deploy();

    const transaction = await wMATIC.deployed();
    console.log("WMATIC deployed to:", wMATIC.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // Verify the contract after deploying
    await run("verify", {
        address: wMATIC.address,
        constructorArgument: [],
    });
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
