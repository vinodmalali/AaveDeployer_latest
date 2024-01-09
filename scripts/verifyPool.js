const { ethers, run } = require("hardhat");

require("dotenv").config({ path: ".env" });

const {writeToFile, getValueByKey} = require("../helper/readAndWriteContractAddress");

const {initializePoolAndProvider} = require('../helper/initPoolAndProvider');

module.exports.deployLendingPool = async function () {
    // Deploy the libraries first
    const ReserveLogic = await ethers.getContractFactory("contracts/LendingPool.sol:ReserveLogic");
    const reserveLogic = await ReserveLogic.deploy();
    const reserveLogicTransaction = await reserveLogic.deployed();
    console.log("ReserveLogic deployed to:", reserveLogic.address);

    await ethers.provider.waitForTransaction(reserveLogicTransaction.deployTransaction.hash, 5);

    // await run("verify", {
    //     contract: "contracts/LendingPool.sol:ReserveLogic",
    //     address: reserveLogic.address,
    //     constructorArguments: [], // Update this if your constructor takes arguments
    // });

    const GenericLogic = await ethers.getContractFactory("contracts/LendingPool.sol:GenericLogic");
    const genericLogic = await GenericLogic.deploy();
    const genericLogicTransaction = await genericLogic.deployed();
    console.log("GenericLogic deployed to:", genericLogic.address);

    
    await ethers.provider.waitForTransaction(genericLogicTransaction.deployTransaction.hash, 5);

    // await run("verify", {
    //     contract: "contracts/LendingPool.sol:GenericLogic",
    //     address: genericLogic.address,
    //     constructorArguments: [], // Update this if your constructor takes arguments
    // });

    const ValidationLogic = await ethers.getContractFactory("contracts/LendingPool.sol:ValidationLogic", {
        libraries: {
            GenericLogic: genericLogic.address,
        },
    });

    const validationLogic = await ValidationLogic.deploy();
    const validationLogicTransaction = await validationLogic.deployed();
    console.log("ValidationLogic deployed to:", validationLogic.address);

    await ethers.provider.waitForTransaction(validationLogicTransaction.deployTransaction.hash, 5);

    // await run("verify", {
    //     contract: "contracts/LendingPool.sol:ValidationLogic",
    //     address: validationLogic.address,
    //     constructorArguments: [], // Update this if your constructor takes arguments
    // });

    // Deploy the LendingPool contract with linked libraries
    const LendingPool = await ethers.getContractFactory("LendingPool", {
        libraries: {
            ReserveLogic: reserveLogic.address,
            ValidationLogic: validationLogic.address,
        },
    });

    const lendingPool = await LendingPool.deploy();
    const lendingPoolTransaction = await lendingPool.deployed();
    console.log("LendingPool deployed to:", lendingPool.address);

    await ethers.provider.waitForTransaction(lendingPoolTransaction.deployTransaction.hash, 5);

    const newData = {
        "ReserveLogic": reserveLogic.address,
        "GenericLogic": genericLogic.address,
        "ValidationLogic": validationLogic.address,
        "LendingPool": lendingPool.address
    }

    await writeToFile(newData);

    const addressProvider = await getValueByKey('LendingPoolAddressProvider');

    await initializePoolAndProvider(lendingPool.address, addressProvider);

    // await run("verify", {
    //     address: lendingPool.address,
    //     constructorArguments: [], // Update this if your constructor takes arguments
    // });

    // Continue with any additional deployment steps or verification

    return lendingPool;
}

// deployLendingPool()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });
