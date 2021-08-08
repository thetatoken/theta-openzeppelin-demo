
## OpenZeppelin test cases adapted for Theta

This repository adapts the test cases for [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) for the Theta blockchain.

### Setup 

```
yarn
```

### Run tests

 First setup the Theta local privatenet with the Theta/Ethereum RPC Adaptor [following this guide](https://docs.thetatoken.org/docs/setup-local-theta-ethereum-rpc-adaptor). The ETH RPC adaptor running at `http://localhost:18888/rpc` interacts with the javascript code by translating the Theta RPC interface into the ETH RPC interface. Then, run the tests with the following commands:

```
// Run all tests
npx hardhat test --network theta_privatenet 

// Run individual tests
npx hardhat test test/utils/math/* --network theta_privatenet
npx hardhat test test/proxy/transparent/ProxyAdmin.test.js --network theta_privatenet
npx hardhat test test/utils/*.test.js
```

