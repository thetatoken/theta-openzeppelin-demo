/// ENVVAR
// - ENABLE_GAS_REPORT
// - CI
// - COMPILE_MODE

const fs = require('fs');
const path = require('path');
const argv = require('yargs/yargs')()
  .env('')
  .options({
    ci: {
      type: 'boolean',
      default: false,
    },
    gas: {
      alias: 'enableGasReport',
      type: 'boolean',
      default: false,
    },
    mode: {
      alias: 'compileMode',
      type: 'string',
      choices: [ 'production', 'development' ],
      default: 'development',
    },
    compiler: {
      alias: 'compileVersion',
      type: 'string',
      default: '0.8.3',
    },
  })
  .argv;

require('@nomiclabs/hardhat-truffle5');
require('solidity-coverage');

if (argv.enableGasReport) {
  require('hardhat-gas-reporter');
}

for (const f of fs.readdirSync(path.join(__dirname, 'hardhat'))) {
  require(path.join(__dirname, 'hardhat', f));
}

const withOptimizations = argv.enableGasReport || argv.compileMode === 'production';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: argv.compiler,
    settings: {
      optimizer: {
        enabled: withOptimizations,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 1000000000,
  },
  networks: {
    hardhat: {
      blockGasLimit: 10000000,
      allowUnlimitedContractSize: !withOptimizations,
    },
    theta_privatenet: {
      url: "http://localhost:18888/rpc",
      accounts: [
        "1111111111111111111111111111111111111111111111111111111111111111", // 0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A
        "2222222222222222222222222222222222222222222222222222222222222222", // 0x1563915e194D8CfBA1943570603F7606A3115508
        "3333333333333333333333333333333333333333333333333333333333333333", // 0x5CbDd86a2FA8Dc4bDdd8a8f69dBa48572EeC07FB
        "4444444444444444444444444444444444444444444444444444444444444444", // 0x7564105E977516C53bE337314c7E53838967bDaC
        "5555555555555555555555555555555555555555555555555555555555555555", // 0xe1fAE9b4fAB2F5726677ECfA912d96b0B683e6a9
        "6666666666666666666666666666666666666666666666666666666666666666", // 0xdb2430B4e9AC14be6554d3942822BE74811A1AF9
        "7777777777777777777777777777777777777777777777777777777777777777", // 0xAe72A48c1a36bd18Af168541c53037965d26e4A8
        "8888888888888888888888888888888888888888888888888888888888888888", // 0x62f94E9AC9349BCCC61Bfe66ddAdE6292702EcB6
        "9999999999999999999999999999999999999999999999999999999999999999", // 0x0D8e461687b7D06f86EC348E0c270b0F279855F0
        "1000000000000000000000000000000000000000000000000000000000000000", // 0x7B2419E0Ee0BD034F7Bf24874C12512AcAC6e21C
      ],
      chainId: 366,
      gasPrice: 4000000000000
    },
    ganache: {
      url: `http://127.0.0.1:8545`,
    },
  },
  gasReporter: {
    currency: 'USD',
    outputFile: argv.ci ? 'gas-report.txt' : undefined,
  },
};
