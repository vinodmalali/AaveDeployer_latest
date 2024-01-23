const { ethers } = require("hardhat");

require("dotenv").config({ path: ".env" });

const {setAssetPrice} = require("../helper/setAssetPrice");

const {readFromFile, writeToFile} = require("../helper/readAndWriteContractAddress");

const {activateReserve,enableBorrowingOnReserve,enableReserveStableRate, configureReserveAsCollateral} = require("../helper/activateReserve");

const {initToken} = require("../helper/initTokens");

async function initializeConfigAndProvider() {

   const addresses = await readFromFile();
   
    const dai = addresses.dai;

    const uni = addresses.uni;

    const providerAdr = addresses.LendingPoolAddressProvider;

    // const providerAdr = "0x736Ec893C3e654b554894E9De953995D32E60dbe";

    //IncentiveController

    const incentiveControllerFactory = await ethers.getContractFactory("AaveIncentivesController");

    const incentiveControllerContract = await incentiveControllerFactory.attach(addresses.AaveIncentiveController);

    const initializerewardVaultInIncentiveTx = await incentiveControllerContract.initialize(process.env.WALLET);

    await initializerewardVaultInIncentiveTx.wait();

    console.log("Initailized wallet address As reward vault IncentiveController Implementation contract");

    //Registry 

    const registryFactory = await ethers.getContractFactory("LendingPoolAddressesProviderRegistry");

    const registryContract = await registryFactory.attach(addresses.LendingPoolRegistry);

    const initializeProviderInInregistryTx = await registryContract.registerAddressesProvider(providerAdr,1);

    await initializeProviderInInregistryTx.wait();

    console.log("Initailized Address Provider in registry Implementation contract");

    //Configurator

    const configuratorFactory = await ethers.getContractFactory("LendingPoolConfigurator");

    const configuratorContract = await configuratorFactory.attach(addresses.LendingPoolConfigurator);

   const initializeProviderInConfigTx = await configuratorContract.initialize(providerAdr);

    await initializeProviderInConfigTx.wait();

    console.log("Initailized Address Provider in Configurator Implementation contract");

    LendingPoolAddressesProvider

    const lendingPoolAddressProviderFactory = await ethers.getContractFactory("LendingPoolAddressesProvider");

    const lendingPoolAddressProviderContract = await lendingPoolAddressProviderFactory.attach(providerAdr);

    const getLendingPoolProxy = await lendingPoolAddressProviderContract.getLendingPool();


    const setConfigImplTx = await lendingPoolAddressProviderContract.setLendingPoolConfiguratorImpl(addresses.LendingPoolConfigurator);

    await setConfigImplTx.wait();

    console.log("Configurator has been set in Provider, and a proxy contract for Lending Pool Configurator is created");
    
    
    //initToken
    
    await initToken(getLendingPoolProxy, addresses.dai, addresses.aTokenDAI, "Aave Matic Market DAI", "amDAI", addresses.stableDebtTokenDAI, "Aave Matic Market stable debt DAI", "stableDebtmDAI", addresses.variableDebtTokenDAI, "Aave Matic Market variable debt mDAI", "variableDebtmDAI");

    await initToken(getLendingPoolProxy, addresses.uni, addresses.aTokenUNI, "Aave Matic Market UNI", "amUNI", addresses.stableDebtTokenUNI, "Aave Matic Market stable debt UNI", "stableDebtmUNI", addresses.variableDebtTokenUNI, "Aave Matic Market variable debt mUNI", "variableDebtmUNI");

    await initToken(getLendingPoolProxy, addresses.wMATIC, addresses.aTokenWMATIC, "Aave Matic Market WMATIC", "amWMATIC", addresses.stableDebtTokenWMATIC, "Aave Matic Market stable debt WMATIC", "stableDebtmWMATIC", addresses.variableDebtTokenWMATIC, "Aave Matic Market variable debt mWMATIC", "variableDebtmWMATIC");

    await initToken(getLendingPoolProxy, addresses.aave, addresses.aTokenAave, "Aave Matic Market AAVE", "amAAVE", addresses.stableDebtTokenAave, "Aave Matic Market stable debt AAVE", "stableDebtmAAVE", addresses.variableDebtTokenAave, "Aave Matic Market variable debt mAAVE", "variableDebtmAAVE");

    await initToken(getLendingPoolProxy, addresses.usdt, addresses.aTokenUSDT, "Aave Matic Market USDT", "amUSDT", addresses.stableDebtTokenUSDT, "Aave Matic Market stable debt USDT", "stableDebtmUSDT", addresses.variableDebtTokenUSDT, "Aave Matic Market variable debt mUSDT", "variableDebtmUSDT");

    await initToken(getLendingPoolProxy, addresses.usdc, addresses.aTokenUSDC, "Aave Matic Market USDC", "amUSDC", addresses.stableDebtTokenUSDC, "Aave Matic Market stable debt USDC", "stableDebtmUSDC", addresses.variableDebtTokenUSDC, "Aave Matic Market variable debt mUSDC", "variableDebtmUSDC");

    await initToken(getLendingPoolProxy, addresses.sg, addresses.aTokenSG, "Aave Matic Market SG", "amSG", addresses.stableDebtTokenSG, "Aave Matic Market stable debt SG", "stableDebtmSG", addresses.variableDebtTokenSG, "Aave Matic Market variable debt mSG", "variableDebtmSG");

    console.log("all initToken is done");

   // provider set all

   const priceOracle = addresses.PriceOracle;

   const collateralManager = addresses.LendingPoolCollateralManager;

   const rateOracle = addresses.LendingRateOracle;
   
   const setPriceOracleTx = await lendingPoolAddressProviderContract.setPriceOracle(priceOracle);

   await setPriceOracleTx.wait();

   const setPoolAdminTx = await lendingPoolAddressProviderContract.setPoolAdmin(process.env.WALLET);

   await setPoolAdminTx.wait();

   const setEmergencyPoolAdminTx = await lendingPoolAddressProviderContract.setEmergencyAdmin(process.env.WALLET);

   await setEmergencyPoolAdminTx.wait();

   const setLendingPoolCollateralManagerTx = await lendingPoolAddressProviderContract.setLendingPoolCollateralManager(collateralManager);

   await setLendingPoolCollateralManagerTx.wait();

   const setLendingRateOracleTx = await lendingPoolAddressProviderContract.setLendingRateOracle(rateOracle);

   await setLendingRateOracleTx.wait();

   console.log("priceOracle, Pooladmin, EmergencyPoolAdmin, CollateralManager and rateOracle has been set in Provider");

   const getLendingPoolConfigurator = await lendingPoolAddressProviderContract.getLendingPoolConfigurator();
    
   const newData = {"LendingPoolConfiguratorProxy": getLendingPoolConfigurator};

   await writeToFile(newData);

   
   const lendingPoolConfiguratorFactory = await ethers.getContractFactory("LendingPoolConfigurator");

    const lendingPoolConfiguratorContract = await lendingPoolConfiguratorFactory.attach(getLendingPoolConfigurator);
    
    //to do batchInitReserve



    const incentivesController = addresses.AaveIncentiveController;

    // const incentivesController = "0xcF38BA0911A8bb1CDbc95d0cFba9c37FEfDf2cF8";

    

    let input = [
                 [addresses.aTokenDAI, addresses.stableDebtTokenDAI, addresses.variableDebtTokenDAI, "18", addresses.DAIInterestRateStrategy, addresses.dai, process.env.WALLET, incentivesController, "DAI", "Aave Matic Market DAI", "amDAI", "Aave Matic Market variable debt DAI", "variableDebtmDAI", "Aave Matic Market stable debt DAI", "stableDebtmDAI", "0x10"],
                 [addresses.aTokenUNI, addresses.stableDebtTokenUNI, addresses.variableDebtTokenUNI, "18", addresses.UNIInterestRateStrategy, addresses.uni, process.env.WALLET, incentivesController, "UNI", "Aave Matic Market UNI", "amUNI", "Aave Matic Market variable debt UNI", "variableDebtmUNI", "Aave Matic Market stable debt UNI", "stableDebtmUNI", "0x10"],               
                 [addresses.aTokenWMATIC, addresses.stableDebtTokenWMATIC, addresses.variableDebtTokenWMATIC, "18", addresses.WMATICInterestRateStrategy, addresses.wMATIC, process.env.WALLET, incentivesController, "Wrapped Matic", "Aave Matic Market WMATIC","amWMATIC", "Aave Matic Market variable debt mWMATIC","variableDebtmWMATIC", "Aave Matic Market stable debt WMATIC","stableDebtmWMATIC", "0x10"],
                 [addresses.aTokenAave, addresses.stableDebtTokenAave, addresses.variableDebtTokenAave, "18", addresses.AaveInterestRateStrategy, addresses.aave, process.env.WALLET, incentivesController, "Aave", "Aave Matic Market AAVE","amAAVE", "Aave Matic Market variable debt mAAVE","variableDebtmAAVE", "Aave Matic Market stable debt AAVE","stableDebtmAAVE", "0x10"],
                 [addresses.aTokenUSDT, addresses.stableDebtTokenUSDT, addresses.variableDebtTokenUSDT, "18", addresses.USDTInterestRateStrategy, addresses.usdt, process.env.WALLET, incentivesController, "USDT", "Aave Matic Market USDT","amUSDT", "Aave Matic Market variable debt mUSDT","variableDebtmUSDT", "Aave Matic Market stable debt USDT","stableDebtmUSDT", "0x10"],
                 [addresses.aTokenUSDC, addresses.stableDebtTokenUSDC, addresses.variableDebtTokenUSDC, "18", addresses.USDCInterestRateStrategy, addresses.usdc, process.env.WALLET, incentivesController, "USDc", "Aave Matic Market USDC","amUSDC", "Aave Matic Market variable debt mUSDC","variableDebtmUSDC", "Aave Matic Market stable debt USDC","stableDebtmUSDC", "0x10"],
                 [addresses.aTokenSG, addresses.stableDebtTokenSG, addresses.variableDebtTokenSG, "18", addresses.SGInterestRateStrategy, addresses.sg, process.env.WALLET, incentivesController, "SakhaGlobal", "Aave Matic Market SG","amSG", "Aave Matic Market variable debt mSG","variableDebtmSG", "Aave Matic Market stable debt SG","stableDebtmSG", "0x10"]                
                ]

    const batchInitReserveTx = await lendingPoolConfiguratorContract.batchInitReserve(input);

    await batchInitReserveTx.wait();

    console.log("batchInitReserve completed");

    
    //price oracle 

    
    await setAssetPrice(addresses.dai, "495180000000000", priceOracle);

    await setAssetPrice(addresses.uni, "3200000000000000", priceOracle);

    await setAssetPrice(addresses.wMATIC, "360000000000000", priceOracle);

    await setAssetPrice(addresses.aave, "41000000000000000", priceOracle);

    await setAssetPrice(addresses.usdt, "380000000000000", priceOracle);

    await setAssetPrice(addresses.usdc, "380000000000000", priceOracle);

    await setAssetPrice(addresses.sg, "42000000000000000", priceOracle);

    

    console.log("prices set for DAI and UNI");

    await activateReserve(addresses.LendingPoolConfiguratorProxy, addresses.dai);

    await activateReserve(addresses.LendingPoolConfiguratorProxy, addresses.uni);

    await activateReserve(addresses.LendingPoolConfiguratorProxy, addresses.wMATIC);

    await activateReserve(addresses.LendingPoolConfiguratorProxy, addresses.aave);

    await activateReserve(addresses.LendingPoolConfiguratorProxy, addresses.usdt);

    await activateReserve(addresses.LendingPoolConfiguratorProxy, addresses.usdc);

    await activateReserve(addresses.LendingPoolConfiguratorProxy, addresses.sg);

    console.log("activated Reserve for DAI and UNI");

    await enableBorrowingOnReserve(addresses.LendingPoolConfiguratorProxy, addresses.dai);

    await enableBorrowingOnReserve(addresses.LendingPoolConfiguratorProxy, addresses.uni);

    await enableBorrowingOnReserve(addresses.LendingPoolConfiguratorProxy, addresses.wMATIC);

    await enableBorrowingOnReserve(addresses.LendingPoolConfiguratorProxy, addresses.aave);

    await enableBorrowingOnReserve(addresses.LendingPoolConfiguratorProxy, addresses.usdt);

    await enableBorrowingOnReserve(addresses.LendingPoolConfiguratorProxy, addresses.usdc);

    await enableBorrowingOnReserve(addresses.LendingPoolConfiguratorProxy, addresses.sg);


    console.log("enableBorrowingOnReserve for DAI and UNI");

    await enableReserveStableRate(addresses.LendingPoolConfiguratorProxy, addresses.dai);

    await enableReserveStableRate(addresses.LendingPoolConfiguratorProxy, addresses.uni);

    await enableReserveStableRate(addresses.LendingPoolConfiguratorProxy, addresses.wMATIC);

    await enableReserveStableRate(addresses.LendingPoolConfiguratorProxy, addresses.aave);

    await enableReserveStableRate(addresses.LendingPoolConfiguratorProxy, addresses.usdt);

    await enableReserveStableRate(addresses.LendingPoolConfiguratorProxy, addresses.usdc);

    await enableReserveStableRate(addresses.LendingPoolConfiguratorProxy, addresses.sg);


    console.log("enableReserveStableRate ");

    await configureReserveAsCollateral(addresses.LendingPoolConfiguratorProxy, addresses.dai);

    await configureReserveAsCollateral(addresses.LendingPoolConfiguratorProxy, addresses.uni);

    await configureReserveAsCollateral(addresses.LendingPoolConfiguratorProxy, addresses.wMATIC);

    await configureReserveAsCollateral(addresses.LendingPoolConfiguratorProxy, addresses.aave);

    await configureReserveAsCollateral(addresses.LendingPoolConfiguratorProxy, addresses.usdt);

    await configureReserveAsCollateral(addresses.LendingPoolConfiguratorProxy, addresses.usdc);

    await configureReserveAsCollateral(addresses.LendingPoolConfiguratorProxy, addresses.sg);


    console.log("configureReserveAsCollateral for DAI and UNI");


}

initializeConfigAndProvider()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
