const { senderAddress, senderPrivateKey, agreementWasmPath, apiUrlKey, zkAgreementAddress, proofPath } = require("../config.js")
const wc = require("../../agreement_js/witness_calculator.js")
const { ethers, JsonRpcProvider } = require("ethers")
const { utils } = require("../utils/util.js")
const fs = require('fs').promises;
const fs2 = require('fs');
const path = require('path');

const signerWallet = new ethers.Wallet(senderPrivateKey);
const provider = new JsonRpcProvider(apiUrlKey);
const signer = signerWallet.connect(provider);

const zkAgreementJSON = require("../../artifacts/contracts/zkAgreement.sol/zkAgreement.json")
const zkAgreementABI = zkAgreementJSON.abi;
const zkAgreementInterface = new ethers.Interface(zkAgreementABI)


const calculateWitness = async () => {
    try {
        const input = {
            secret: utils.generateRandomBitString(256),
            nullifier: utils.generateRandomBitString(256),
        }
        const secretBinary = input.secret.join('');
        const secretString = BigInt('0b' + secretBinary).toString();
        const nullifierBinary = input.nullifier.join('');
        const nullifierString = BigInt('0b' + nullifierBinary).toString();

        const absolutePath = path.resolve(agreementWasmPath);
        const wasmBuffer = await fs.readFile(absolutePath);
        var agreement = await wc(wasmBuffer);

        const witnessResult = await agreement.calculateWitness(input, 0);

        const commitment = witnessResult[1];
        const nullifierHash = witnessResult[2];

        const value = ethers.parseEther("0.001");
        const unsignedTx = {
            to: zkAgreementAddress,
            from: senderAddress,
            value: value,
            data: zkAgreementInterface.encodeFunctionData("agreement", [commitment])
        };
        console.log(unsignedTx)

        const tx = await signer.sendTransaction(unsignedTx);
        await tx.wait();

        const txReceipt = await provider.getTransactionReceipt(tx.hash);
        console.log('Transaction Receipt:', txReceipt);

        const log = txReceipt.logs[0];

        const decodedData = zkAgreementInterface.decodeEventLog("Agreement", log.data, log.topics);
        console.log(decodedData.hashDirections)

        const proofElements = {
            merkleRoot: BigInt(decodedData.root).toString(),
            nullifierHash: nullifierHash.toString(),
            secret: secretString,
            nullifier: nullifierString,
            commitment: commitment.toString(),
            hashPairings: decodedData.hashPairings.map((n) => BigInt(n).toString()),
            hashDirections: decodedData.pairDirection.toString(),
            txHash: tx.hash,
        };

        console.log(proofElements);
        proofB64 = btoa(JSON.stringify(proofElements));
        console.log(proofB64);
        fs2.writeFileSync(proofPath, proofB64);

    } catch (e) {
        console.log(e);
    }

}


module.exports = {
    calculateWitness
};
