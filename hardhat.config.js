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
    localhost: {
      url: urlKey,
      chainId: 31337,
    },
  }

};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  const provider = hre.ethers.provider;

  for (const account of accounts) {
    console.log(
      "%s (%i ETH)",
      account.address,
      hre.ethers.formatGwei(
        // getBalance returns wei amount, format to ETH amount
        await provider.getBalance(account.address)
      )
    );
  }
});

module.exports = config;