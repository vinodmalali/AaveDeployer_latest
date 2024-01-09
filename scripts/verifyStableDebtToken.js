const { ethers, run } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
    let args = [];

    // Deploy LendingPoolAddressProvider contract
    let StableDebtToken = await ethers.getContractFactory("contracts/StableDebtToken.sol:StableDebtToken");
    const stableDebtToken = await StableDebtToken.deploy(...args);

    const transaction = await stableDebtToken.deployed();
    console.log("stableDebtToken deployed to:", stableDebtToken.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // // Verify the contract after deploying
    // await run("verify", {
    //     contract: "contracts/StableDebtToken.sol:StableDebtToken",  // Specify the contract name as a string
    //     address: stableDebtToken.address,
    //     constructorArguments: args,   // Use the correct property name
    // });
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
