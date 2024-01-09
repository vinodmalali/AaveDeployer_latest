const { ethers } = require("hardhat");

require("dotenv").config({ path: ".env" });

async function initializeConfigAndProvider() {

    const configuratorAddress = "0x1668bcB96c37d6cA9eF19178928AdC69F5abb631";

    const lendingPoolAddressProviderAddress = "0x66Fbb7c2337b27C97cB14B5E81165Be7aF228621";

    const configuratorFactory = await ethers.getContractFactory("LendingPoolConfigurator");

    const configuratorContract = await configuratorFactory.attach(configuratorAddress);

    const initializeProviderInConfigTx = await configuratorContract.initialize(lendingPoolAddressProviderAddress);

    await initializeProviderInConfigTx.wait();

    console.log("Initailized Address Provider in Configurator Implementation contract");

    const lendingPoolAddressProviderFactory = await ethers.getContractFactory("LendingPoolAddressesProvider");

    const lendingPoolAddressProviderContract = await lendingPoolAddressProviderFactory.attach(lendingPoolAddressProviderAddress);

    const setConfigImplTx = await lendingPoolAddressProviderContract.setLendingPoolConfiguratorImpl(configuratorAddress);

    await setConfigImplTx.wait();

    console.log("Configurator has been set in Provider, and a proxy contract for Lending Pool Configurator is created");

}

initializeConfigAndProvider()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
