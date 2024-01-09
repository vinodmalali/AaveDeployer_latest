# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```


### ADD in README
```
ALCHEMY_API_KEY_URL="https://dashboard.alchemy.com/"
MUMBAI_PRIVATE_KEY="YOUR_PRIAVTE_KEY"
POLYGONSCAN_KEY="https://polygonscan.com/myapikey"
```

### To run deploy and verify script
```
npx hardhat run scripts/verifyProvider.js --network mumbai
```

### To verify through CLI
```
For single argument
npx hardhat verify --network mumbai 0x1a5f55A3778DC87aBdb587ac3c93Fb3357Dcd0fb "MATIC"

For multiple arguments
npx hardhat verify --network mumbai 0x0Bf99E0df07f620b48f054949b9773221F0F4a00 "0x9F03DC0D6473A102C7454A81BE0243f05622ca52" "0x6443E9F7282c27C517e61cF938cfe17Ba376E0EF"
```
