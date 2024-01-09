
module.exports.setAssetPrice = async function (asset, price, priceOracleAddress) {
    const priceOracleFactory = await ethers.getContractFactory("PriceOracle");

    const priceOracleContract = await priceOracleFactory.attach(priceOracleAddress);

    const setAssetPriceTx = await priceOracleContract.setAssetPrice(asset,price);

    await setAssetPriceTx.wait();

}