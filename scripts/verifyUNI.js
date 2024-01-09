const { ethers, run } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {

    let args = ["UNI", "UNI" , "18"];

    // Deploy LendingPoolAddressProvider contract
    let MintableERC20 = await ethers.getContractFactory("MintableERC20");
    const mintableERC20 = await MintableERC20.deploy(...args);

    const transaction = await mintableERC20.deployed();
    console.log("MintableERC20 deployed to:", mintableERC20.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // Verify the contract after deploying
    await run("verify", {
        address: mintableERC20.address,
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




