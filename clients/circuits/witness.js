require('dotenv').config();
const wc = require("../../agreement_js/witness_calculator.js")
const { ethers } = require("ethers")

const { prng } = require("../utils/prng.js")
const fs = require('fs').promises;
const path = require('path');

const wasmPath = "agreement_js/agreement.wasm";

const senderAddress = process.env.SENDER_ADDRESS;
const agreementAddress = process.env.AGREEMENT_ADDRESS;
const agreementJSON = require("../../artifacts/contracts/zkAgreement.sol/zkAgreement.json")
const agreementABI = agreementJSON.abi;
const agreeementInterface = new ethers.Interface(agreementABI)
const privateKey = process.env.PRIVATE_KEY;
const urlKey = process.env.API_URL_KEY
const signer = new ethers.Wallet(privateKey)
const provider = new ethers.JsonRpcProvider(urlKey)

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

    console.log(commitment)
    console.log(nullifierHash)

    const value = BigInt("1000000000000000000").toString();
    const tx = {
        to: agreementAddress,
        from: senderAddress,
        value: value,
        data: agreeementInterface.encodeFunctionData("agreement", [commitment])
    };

    try {
        const signedTx = await signer.signTransaction(tx);

        const receipt = await provider.send(signedTx);
        const log = receipt.logs[0];

        const decodedData = agreeementInterface.decodeEventLog("Agreement", log.Data, log.topics);
        // const proofElements = {
        //     nullifierHash: `${nullifierHash}`,
        //     secret: secret,
        //     nullifier: nullifier,
        //     commitment: `${commitment}`,
        //     txHash: txHash
        // };

        console.log(decodedData);

        updateProofElements(btoa(JSON.stringify(proofElements)));
    } catch (e) {
        console.log(e);
    }


    console.log(nullifierHash)
    console.log(commitment)
}


module.exports = {
    calculateWitness
};
