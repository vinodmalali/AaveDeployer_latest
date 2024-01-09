const { ethers } = require("hardhat");

require("dotenv").config({ path: ".env" });

const {setAssetPrice} = require("../helper/setAssetPrice");

const {readFromFile, writeToFile} = require("../helper/readAndWriteContractAddress");

const {activateReserve,enableBorrowingOnReserve,enableReserveStableRate, configureReserveAsCollateral} = require("../helper/activateReserve");

async function initializeConfigAndProvider() {

   const addresses = await readFromFile();
   
    const dai = addresses.dai;

    const uni = addresses.uni;

    const providerAdr = addresses.LendingPoolAddressProvider;

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

    //LendingPoolAddressesProvider

    const lendingPoolAddressProviderFactory = await ethers.getContractFactory("LendingPoolAddressesProvider");

    const lendingPoolAddressProviderContract = await lendingPoolAddressProviderFactory.attach(providerAdr);

    const getLendingPoolProxy = await lendingPoolAddressProviderContract.getLendingPool();


    const setConfigImplTx = await lendingPoolAddressProviderContract.setLendingPoolConfiguratorImpl(addresses.LendingPoolConfigurator);

    await setConfigImplTx.wait();

    console.log("Configurator has been set in Provider, and a proxy contract for Lending Pool Configurator is created");
    
    //DAI
    //aTokenDAI

    const aTokenDAIAddress = addresses.aTokenDAI;

    const underlyingAssetDAI = addresses.dai;

    const incentiveControllerAddress = addresses.AaveIncentiveController;
    
    const aTokenDAIFactory = await ethers.getContractFactory("AToken");

    const aTokenDAIContract = await aTokenDAIFactory.attach(aTokenDAIAddress);

    let args = [getLendingPoolProxy,process.env.WALLET,underlyingAssetDAI,incentiveControllerAddress,"18","Aave Matic Market DAI","amDAI","0x00"];

    const initializeInaTokenDAITx = await aTokenDAIContract.initialize(...args);

    await initializeInaTokenDAITx.wait();

    console.log("initialized the aTokenDAI contract");

    //StableDebt DAI 

    const stableDebtTokenDAIAddress = addresses.stableDebtTokenDAI;

    const stableDebtTokenDAIFactory = await ethers.getContractFactory("contracts/StableDebtToken.sol:StableDebtToken");

    const stableDebtTokenDAIContract = await stableDebtTokenDAIFactory.attach(stableDebtTokenDAIAddress);

    let stableDebtTokenDAIArgs = [getLendingPoolProxy,underlyingAssetDAI,incentiveControllerAddress,"18","Aave Matic Market stable debt DAI","stableDebtmDAI","0x00"]

    const initializeNameAndSymbolInstableDebtTokenDAITx = await stableDebtTokenDAIContract.initialize(...stableDebtTokenDAIArgs);

    await initializeNameAndSymbolInstableDebtTokenDAITx.wait();

    console.log("initialized the StableDebt DAI contract");

    //VariableDebt DAI Initialize

    const variableDebtTokenDAIAddress = addresses.variableDebtTokenDAI;

    const variableDebtTokenFactory = await ethers.getContractFactory("contracts/VariableDebtToken.sol:VariableDebtToken");

    const variableDebtTokenContract = await variableDebtTokenFactory.attach(variableDebtTokenDAIAddress);

    let variableDebtTokenArgs = [getLendingPoolProxy,underlyingAssetDAI,incentiveControllerAddress,"18","Aave Matic Market variable debt mDAI","variableDebtmDAI","0x00"]

    const initializeNameAndSymbolInvariableDebtTokenTx = await variableDebtTokenContract.initialize(...variableDebtTokenArgs);

    await initializeNameAndSymbolInvariableDebtTokenTx.wait();

    console.log("initialized the VariableDebt DAI contract");

    //UNI
    //aTokenUNI

    const aTokenUNIAddress = addresses.aTokenUNI;

    const underlyingAssetUNI = addresses.uni;
    
    const aTokenUNIFactory = await ethers.getContractFactory("AToken");

    const aTokenUNIContract = await aTokenUNIFactory.attach(aTokenUNIAddress);

    let argsUNI = [getLendingPoolProxy,process.env.WALLET,underlyingAssetUNI,incentiveControllerAddress,"18","Aave Matic Market UNI","amUNI","0x00"];

    const initializeInaTokenUNITx = await aTokenUNIContract.initialize(...argsUNI);

    await initializeInaTokenUNITx.wait();

    console.log("initialized the aTokenUNI contract");

    //StableDebt UNI 

    const stableDebtTokenUNIAddress = addresses.stableDebtTokenUNI;

    const stableDebtTokenUNIFactory = await ethers.getContractFactory("contracts/StableDebtToken.sol:StableDebtToken");

    const stableDebtTokenUNIContract = await stableDebtTokenUNIFactory.attach(stableDebtTokenUNIAddress);

    let stableDebtTokenUNIArgs = [getLendingPoolProxy,underlyingAssetUNI,incentiveControllerAddress,"18","Aave Matic Market stable debt UNI","stableDebtmUNI","0x00"]

    const initializeNameAndSymbolInstableDebtTokenUNITx = await stableDebtTokenUNIContract.initialize(...stableDebtTokenUNIArgs);

    await initializeNameAndSymbolInstableDebtTokenUNITx.wait();

    console.log("initialized the StableDebt UNI contract");

    //VariableDebt UNI Initialize

    const variableDebtTokenUNIAddress = addresses.variableDebtTokenUNI;

    const variableDebtTokenUNIFactory = await ethers.getContractFactory("contracts/VariableDebtToken.sol:VariableDebtToken");

    const variableDebtTokenUNIContract = await variableDebtTokenUNIFactory.attach(variableDebtTokenUNIAddress);

    let variableDebtTokenUNIArgs = [getLendingPoolProxy,underlyingAssetUNI,incentiveControllerAddress,"18","Aave Matic Market variable debt mUNI","variableDebtmUNI","0x00"]

    const initializeNameAndSymbolInvariableDebtTokenUNITx = await variableDebtTokenUNIContract.initialize(...variableDebtTokenUNIArgs);

    await initializeNameAndSymbolInvariableDebtTokenUNITx.wait();

    console.log("initialized the VariableDebt uni contract");

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

    const DaiInterestRateStrategyAddress = addresses.DAIInterestRateStrategy;

    const UniInterestRateStrategyAddress = addresses.UNIInterestRateStrategy;

    const incentivesController = addresses.AaveIncentiveController;

    let input = [
                 [aTokenDAIAddress, stableDebtTokenDAIAddress, variableDebtTokenDAIAddress, "18", DaiInterestRateStrategyAddress, underlyingAssetDAI, process.env.WALLET, incentivesController, "DAI", "Aave Matic Market DAI", "amDAI", "Aave Matic Market variable debt DAI", "variableDebtmDAI", "Aave Matic Market stable debt DAI", "stableDebtmDAI", "0x10"],
                 [aTokenUNIAddress, stableDebtTokenUNIAddress, variableDebtTokenUNIAddress, "18", UniInterestRateStrategyAddress, underlyingAssetUNI, process.env.WALLET, incentivesController, "UNI", "Aave Matic Market UNI", "amUNI", "Aave Matic Market variable debt UNI", "variableDebtmUNI", "Aave Matic Market stable debt UNI", "stableDebtmUNI", "0x10"]
                ]

    const batchInitReserveTx = await lendingPoolConfiguratorContract.batchInitReserve(input);

    await batchInitReserveTx.wait();

    console.log("batchInitReserve completed");

    //price oracle 

    
    let tx = await setAssetPrice(addresses.dai, "495180000000000", addresses.PriceOracle);

    let tx2 = await setAssetPrice(addresses.uni, "3200000000000000", addresses.PriceOracle);

    console.log("prices set for DAI and UNI");

    await activateReserve(addresses.LendingPoolConfiguratorProxy, addresses.dai);

    await activateReserve(addresses.LendingPoolConfiguratorProxy, addresses.uni);

    console.log("activated Reserve for DAI and UNI");

    await enableBorrowingOnReserve(addresses.LendingPoolConfiguratorProxy, addresses.dai);

    await enableBorrowingOnReserve(addresses.LendingPoolConfiguratorProxy, addresses.uni);

    console.log("enableBorrowingOnReserve for DAI and UNI");

    await enableReserveStableRate(addresses.LendingPoolConfiguratorProxy, addresses.dai);

    await enableReserveStableRate(addresses.LendingPoolConfiguratorProxy, addresses.uni);

    console.log("enableReserveStableRate for DAI and UNI");

    await configureReserveAsCollateral(addresses.LendingPoolConfiguratorProxy, addresses.dai);

    await configureReserveAsCollateral(addresses.LendingPoolConfiguratorProxy, addresses.uni);

    console.log("configureReserveAsCollateral for DAI and UNI");


}

initializeConfigAndProvider()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
