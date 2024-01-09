const { ethers } = require("hardhat");

const {writeToFile, getValueByKey} = require('./readAndWriteContractAddress');

module.exports.initializePoolAndProvider = async function (_lendingPoolAddress, _lendingPoolAddressProviderAddress) {

    const lendingPoolAddress = _lendingPoolAddress;

    const lendingPoolAddressProviderAddress = _lendingPoolAddressProviderAddress;

    const reserveLogic = await getValueByKey("ReserveLogic");

    console.log(reserveLogic);

    const validationLogic = await getValueByKey("ValidationLogic");

    console.log(validationLogic);

    const lendingPoolFactory = await ethers.getContractFactory("LendingPool", {
        libraries: {
            ReserveLogic: reserveLogic,
            ValidationLogic: validationLogic,
        },
    });

    const lendingPoolContract = await lendingPoolFactory.attach(lendingPoolAddress);

    const initializeProviderInPoolTx = await lendingPoolContract.initialize(lendingPoolAddressProviderAddress);

    await initializeProviderInPoolTx.wait();

    console.log("Initailized Address Provider in Lending Pool Implementation contract");

    const lendingPoolAddressProviderFactory = await ethers.getContractFactory("LendingPoolAddressesProvider");

    const lendingPoolAddressProviderContract = await lendingPoolAddressProviderFactory.attach(lendingPoolAddressProviderAddress);

    const setLendingPoolImplTx = await lendingPoolAddressProviderContract.setLendingPoolImpl(lendingPoolAddress);

    await setLendingPoolImplTx.wait();

    console.log("Lending Pool has been set in Provider, and a proxy contract for Lending Pool is created");

    const getLendingPoolProxyTx = await lendingPoolAddressProviderContract.getLendingPool();

    const newData = { "LendingPoolProxy": getLendingPoolProxyTx };

    await writeToFile(newData);

}

// initializePoolAndProvider()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });
