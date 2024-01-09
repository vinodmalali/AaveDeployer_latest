const { ethers, run } = require("hardhat");
const {writeToFile} = require("../helper/readAndWriteContractAddress");
require("dotenv").config({ path: ".env" });

async function deployWMATIC() {
    // Deploy WMATIC contract
    let WMATIC = await ethers.getContractFactory("WMATIC");
    const wMATIC = await WMATIC.deploy();

    const transaction = await wMATIC.deployed();
    console.log("WMATIC deployed to:", wMATIC.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // Verify the contract after deploying
    // await run("verify", {
    //     address: wMATIC.address,
    //     constructorArgument: [],
    // });

    return wMATIC;
}

async function deployMintableERC20(name, symbol, decimals) {
    // Deploy MintableERC20 contract
    let args = [name, symbol, decimals];
    let MintableERC20 = await ethers.getContractFactory("MintableERC20");
    const mintableERC20 = await MintableERC20.deploy(...args);

    const transaction = await mintableERC20.deployed();
    console.log(`${name} deployed to:`, mintableERC20.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // Verify the contract after deploying
    // await run("verify", {
    //     address: mintableERC20.address,
    //     constructorArgument: args,
    // });

    return mintableERC20;
}

async function deployStableDebtToken() {
    let args = [];

    // Deploy StableDebtToken contract
    let StableDebtToken = await ethers.getContractFactory("contracts/StableDebtToken.sol:StableDebtToken");
    const stableDebtToken = await StableDebtToken.deploy(...args);

    const transaction = await stableDebtToken.deployed();
    console.log("stableDebtToken deployed to:", stableDebtToken.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // Verify the contract after deploying
    // await run("verify", {
    //     address: stableDebtToken.address,
    //     constructorArgument: args,
    // });

    return stableDebtToken;
}

async function deployVariableDebtToken() {
    let args = [];

    // Deploy VariableDebtToken contract
    let VariableDebtToken = await ethers.getContractFactory("contracts/VariableDebtToken.sol:VariableDebtToken");
    const variableDebtToken = await VariableDebtToken.deploy(...args);

    const transaction = await variableDebtToken.deployed();
    console.log("variableDebtToken deployed to:", variableDebtToken.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // Verify the contract after deploying
    // await run("verify", {
    //     address: variableDebtToken.address,
    //     constructorArgument: args,
    // });

    return variableDebtToken;
}

async function deployAToken() {
    let args = [];

    // Deploy AToken contract
    let AToken = await ethers.getContractFactory("AToken");
    const aToken = await AToken.deploy(...args);

    const transaction = await aToken.deployed();
    console.log("aToken deployed to:", aToken.address);

    // Wait for 5 confirmations
    await ethers.provider.waitForTransaction(transaction.deployTransaction.hash, 5);

    // Verify the contract after deploying
    // await run("verify", {
    //     address: aToken.address,
    //     constructorArgument: args,
    // });

    return aToken;
}

async function main() {
    const wMATIC = await deployWMATIC();
    const dai = await deployMintableERC20("DAI", "DAI", "18");
    const uni = await deployMintableERC20("UNI", "UNI", "18");
    const aTokenDAI = await deployAToken();
    const aTokenUNI = await deployAToken();
    const stableDebtTokenDAI = await deployStableDebtToken();
    const variableDebtTokenDAI = await deployVariableDebtToken();
    const stableDebtTokenUNI = await deployStableDebtToken();
    const variableDebtTokenUNI = await deployVariableDebtToken();

    const deployedContracts = {
        wMATIC: wMATIC.address,
        dai: dai.address,
        uni: uni.address,
        aTokenDAI: aTokenDAI.address,
        aTokenUNI: aTokenUNI.address,
        stableDebtTokenDAI: stableDebtTokenDAI.address,
        variableDebtTokenDAI: variableDebtTokenDAI.address,
        stableDebtTokenUNI: stableDebtTokenUNI.address,
        variableDebtTokenUNI: variableDebtTokenUNI.address,
    };

    await writeToFile(deployedContracts);

    

    // You can use wMATIC, dai, uni, stableDebtToken, variableDebtToken, and aToken as needed in your further logic.
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });