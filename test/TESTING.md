## Testing

Unit test are critical to OpenZeppelin Contracts. They help ensure code quality and mitigate against security vulnerabilities. The directory structure within the `/test` directory corresponds to the `/contracts` directory.


```
// Run all tests
npx hardhat test --network theta_privatenet 

// Run individual tests
npx hardhat test test/utils/math/* --network theta_privatenet
npx hardhat test test/proxy/transparent/ProxyAdmin.test.js --network theta_privatenet
npx hardhat test test/utils/*.test.js
```
