require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: "0.6.12",
  networks: {
    hardhat: {},
    mumbai: {
      url: process.env.ALCHEMY_API_KEY_URL,
      accounts: [`0x${process.env.MUMBAI_PRIVATE_KEY}`],
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_KEY
    },
    customChains: [
      {
        network: "polygonMumbai",
        chainId: 80001,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://api-testnet.polygonscan.com"
        }
      }
    ]
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};