module.exports.activateReserve = async function (LendingPoolConfiguratorProxy, asset) {

    const configuratorFactory = await ethers.getContractFactory("LendingPoolConfigurator");

    const configuratorContract = await configuratorFactory.attach(LendingPoolConfiguratorProxy);

    const activateReserveTx = await configuratorContract.activateReserve(asset);

    await activateReserveTx.wait();

}

module.exports.enableBorrowingOnReserve = async function (LendingPoolConfiguratorProxy, asset) {

    const configuratorFactory = await ethers.getContractFactory("LendingPoolConfigurator");

    const configuratorContract = await configuratorFactory.attach(LendingPoolConfiguratorProxy);

    const enableBorrowingOnReserveTx = await configuratorContract.enableBorrowingOnReserve(asset,true);

    await enableBorrowingOnReserveTx.wait();

}

module.exports.enableReserveStableRate = async function (LendingPoolConfiguratorProxy, asset) {

    const configuratorFactory = await ethers.getContractFactory("LendingPoolConfigurator");

    const configuratorContract = await configuratorFactory.attach(LendingPoolConfiguratorProxy);

    const enableReserveStableRateTx = await configuratorContract.enableReserveStableRate(asset);

    await enableReserveStableRateTx.wait();

}

module.exports.configureReserveAsCollateral = async function (LendingPoolConfiguratorProxy, asset) {

    const configuratorFactory = await ethers.getContractFactory("LendingPoolConfigurator");

    const configuratorContract = await configuratorFactory.attach(LendingPoolConfiguratorProxy);

    const configureReserveAsCollateralTx = await configuratorContract.configureReserveAsCollateral(asset, "9000", "9500", "10200");

    await configureReserveAsCollateralTx.wait();

}