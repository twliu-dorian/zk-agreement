require("@nomicfoundation/hardhat-toolbox");

const dotenv = require("dotenv");
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
      {
        version: "0.6.11",
      }
    ]
  },
  networks: {
    sepolia: {
      url: urlKey,
      accounts: [privateKey],
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  }

};

module.exports = config;