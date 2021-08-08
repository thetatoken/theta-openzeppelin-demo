
## OpenZeppelin test cases adapted for Theta

This repository adapts the test cases for [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) for the Theta blockchain.

### Setup 

```sh
yarn
```

### Run tests

 First setup the Theta local privatenet with the Theta/Ethereum RPC Adaptor [following this guide](https://docs.thetatoken.org/docs/setup-local-theta-ethereum-rpc-adaptor). The ETH RPC adaptor running at `http://localhost:18888/rpc` interacts with the javascript code by translating the Theta RPC interface into the ETH RPC interface. 
 
 Next, run the following commands to fund the test accounts with some TFuel:
 
 ```sh
 export SEQ=`thetacli query account --address=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab | grep sequence | grep -o '[[:digit:]]\+'`
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+1))
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x1563915e194D8CfBA1943570603F7606A3115508 --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+2))
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x5CbDd86a2FA8Dc4bDdd8a8f69dBa48572EeC07FB --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+3))
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x7564105E977516C53bE337314c7E53838967bDaC --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+4))
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0xe1fAE9b4fAB2F5726677ECfA912d96b0B683e6a9 --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+5))
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0xdb2430B4e9AC14be6554d3942822BE74811A1AF9 --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+6))
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0xAe72A48c1a36bd18Af168541c53037965d26e4A8 --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+7))
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x62f94E9AC9349BCCC61Bfe66ddAdE6292702EcB6 --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+8))
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x0D8e461687b7D06f86EC348E0c270b0F279855F0 --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+9))
thetacli tx send --chain="privatenet" --from=0x2E833968E5bB786Ae419c4d13189fB081Cc43bab --to=0x7B2419E0Ee0BD034F7Bf24874C12512AcAC6e21C --tfuel=10000 --password=qwertyuiop --seq=$(($SEQ+10))
```
 
 Then, run the tests with the following commands:

```sh
# Run all tests
npx hardhat test --network theta_privatenet 

# Run individual tests
npx hardhat test test/utils/math/* --network theta_privatenet
npx hardhat test test/proxy/transparent/ProxyAdmin.test.js --network theta_privatenet
npx hardhat test test/utils/*.test.js
```

