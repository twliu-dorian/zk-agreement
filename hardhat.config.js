require("@nomicfoundation/hardhat-toolbox");

const dotenv = require("dotenv");
const { network } = require("hardhat");
dotenv.config();
const privateKey = process.env.PRIVATE_KEY;
const urlKey = process.env.API_URL_KEY

const config = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: { optimizer: { enabled: true, runs: 200 } }
      },
    ]
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      accounts
    },
    sepolia: {
      url: urlKey,
      accounts: [privateKey],
    },
  }

};

module.exports = config;