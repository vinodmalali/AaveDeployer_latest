const {deployIncentiveController} = require('./verifyIncentiveController');
const {deployRegistry} = require('./verifyRegistry');
const {deployProvider} = require('./verifyProvider');
const {deployCollateralManager} = require('./verifyCollateralManager');
const {deployConfigurator} = require('./verifyPoolConfigurator');
const {deployLendingPool} = require('./verifyPool');
const {deployTokenHelper} = require('./verifyTokenHelper');
const {deployRateOracle} = require('./verifyLendingRateOracle');
const {deployPriceOracle} = require('./verifyPriceOracle');
const {deployAaveOracle} = require('./verifyAaveOracle');
const {deployDataProvider} = require('./verifyAaveProtocolDataProvider');
const {deployInterestRateStrategy} = require('./verifyInterest');

async function main() {

    await deployIncentiveController();
    await deployRegistry();
    await deployProvider();
    await deployCollateralManager();
    await deployConfigurator();
    await deployLendingPool();
    await deployTokenHelper();
    await deployRateOracle();
    await deployPriceOracle();
    await deployAaveOracle();
    await deployDataProvider();
    await deployInterestRateStrategy();

}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
