const { ethers, run } = require("hardhat");
const {readFromFile} = require("../helper/readAndWriteContractAddress");
require("dotenv").config({ path: ".env" });

module.exports.initToken = async function (lendingPoolProxy, underlyingAsset, aTokenAddress, _name, Symbol, stableDebtTokenAddress, stableName, stableSymbol, variableDebtTokenAddress, variableName, variableSymbol) {

    const addresses = await readFromFile();

    //aToken

    const incentiveControllerAddress = addresses.AaveIncentiveController;

    // const incentiveControllerAddress = "0xcF38BA0911A8bb1CDbc95d0cFba9c37FEfDf2cF8";
    
    const aTokenFactory = await ethers.getContractFactory("AToken");

    const aTokenContract = await aTokenFactory.attach(aTokenAddress);

    let args = [lendingPoolProxy,process.env.WALLET,underlyingAsset,incentiveControllerAddress,"18",_name,Symbol,"0x00"];

    const initializeInaTokenTx = await aTokenContract.initialize(...args);

    await initializeInaTokenTx.wait();

    console.log("initialized the aToken contract");

    //StableDebt  


    const stableDebtTokenFactory = await ethers.getContractFactory("contracts/StableDebtToken.sol:StableDebtToken");

    const stableDebtTokenContract = await stableDebtTokenFactory.attach(stableDebtTokenAddress);

    let stableDebtTokenArgs = [lendingPoolProxy,underlyingAsset,incentiveControllerAddress,"18",stableName, stableSymbol,"0x00"]

    const initializeNameAndSymbolInstableDebtTokenTx = await stableDebtTokenContract.initialize(...stableDebtTokenArgs);

    await initializeNameAndSymbolInstableDebtTokenTx.wait();

    console.log("initialized the StableDebt  contract");

    //VariableDebt  Initialize

    const variableDebtTokenFactory = await ethers.getContractFactory("contracts/VariableDebtToken.sol:VariableDebtToken");

    const variableDebtTokenContract = await variableDebtTokenFactory.attach(variableDebtTokenAddress);

    let variableDebtTokenArgs = [lendingPoolProxy,underlyingAsset,incentiveControllerAddress,"18",variableName, variableSymbol,"0x00"]

    const initializeNameAndSymbolInvariableDebtTokenTx = await variableDebtTokenContract.initialize(...variableDebtTokenArgs);

    await initializeNameAndSymbolInvariableDebtTokenTx.wait();

    console.log("initialized the VariableDebt  contract");
}