require('dotenv').config();
const hre = require("hardhat");
const wc = require("../../agreement_js/witness_calculator.js")
const { ethers, JsonRpcProvider } = require("ethers")
const { prng } = require("../utils/prng.js")
const fs = require('fs').promises;
const path = require('path');
const wasmPath = "agreement_js/agreement.wasm";

const privateKey = process.env.PRIVATE_KEY;
const urlKey = process.env.API_URL_KEY;

const signerWallet = new ethers.Wallet(privateKey);
const provider = new JsonRpcProvider(urlKey);
const signer = signerWallet.connect(provider)


provider.getBlockNumber().then((result) => {
    console.log("Current block number: " + result);
});
const senderAddress = process.env.SENDER_ADDRESS;
const agreementAddress = process.env.AGREEMENT_ADDRESS;
const agreementJSON = require("../../artifacts/contracts/zkAgreement.sol/zkAgreement.json")
const agreementABI = agreementJSON.abi;
const agreementInterface = new ethers.Interface(agreementABI)

const calculateWitness = async () => {

    const input = {
        secret: prng.generateRandomBitString(256),
        nullifier: prng.generateRandomBitString(256),
    }
    // console.log(input.secret.length, input.nullifier.length)

    const absolutePath = path.resolve(wasmPath);
    const wasmBuffer = await fs.readFile(absolutePath);
    var agreement = await wc(wasmBuffer);

    const witnessResult = await agreement.calculateWitness(input, 0);

    const commitment = witnessResult[1];
    const nullifierHash = witnessResult[2];

    console.log("commitment    :", commitment)
    console.log("nullifier hash:", nullifierHash)

    const value = BigInt("1000000000").toString();
    const unsignedTx = {
        to: agreementAddress,
        from: senderAddress,
        value: value,
        data: agreementInterface.encodeFunctionData("agreement", [commitment])
    };

    try {
        const tx = await signer.sendTransaction(unsignedTx);
        await tx.wait();

        const txReceipt = await provider.getTransactionReceipt(tx.hash);
        console.log('Transaction Receipt:', txReceipt);

        const log = txReceipt.logs[0];

        const decodedData = agreementInterface.decodeEventLog("Agreement", log.data, log.topics);
        const proofElements = {
            merkleRoot: BigInt(decodedData.root),
            nullifierHash: nullifierHash,
            secret: input.secret,
            nullifier: input.nullifier,
            commitment: commitment,
            hashPairings: decodedData.hashPairings.map((n) => BigInt(n)),
            hashDirections: decodedData.pairDirection,
            txHash: tx.hash,
        };

        console.log(proofElements);

    } catch (e) {
        console.log(e);
    }

}


module.exports = {
    calculateWitness
};
