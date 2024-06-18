# zk-agreement

[TOC]

## How to run it

### To run a hardhat local blockchain

```
npx hardhat node
```

### To use the hardhat console

```
npx hardhat console --network localhost
```

#### Get all signers

```
await ethers.getSigners()
```

#### Get one signer's balance

```
account_balance = await ethers.provider.getBalance(accounts[0].address)
```

### To run zk-agreement

#### Agree

```
node index.js agree --userA alice --userB bob --value 3 --secret 1111010001111010100011110001101110011001001111011000011010011101111000101010011100110011100001001011101101011000110111101101100010011111110000010100100111100011001000101101001100000101101101011111000011100110001010000011101001110011000101010111101010101000
```

#### Evaluate

```
node index.js evaluate --in proof.txt --result 1
```

### Smart Contract

#### Deploy

```
npx hardhat run deployment/deploy.js --network localhost
```

#### Compile

```
npx hardhat compile
```

## High Level Diagram
