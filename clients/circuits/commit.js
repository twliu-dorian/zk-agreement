const { buyerAddress, buyerPrivateKey, recordWasmPath, apiUrlKey, zkAgreementAddress, proofPath } = require("../config.js")
const wc = require("../../record_js/witness_calculator.js")
const { ethers, JsonRpcProvider } = require("ethers")
const { utils } = require("../utils/util.js")
const fs = require('fs').promises;
const fs2 = require('fs');
const path = require('path');

const signerWallet = new ethers.Wallet(buyerPrivateKey);
const provider = new JsonRpcProvider(apiUrlKey);
const signer = signerWallet.connect(provider);

const zkAgreementJSON = require("../../artifacts/contracts/zkAgreement.sol/zkAgreement.json")
const zkAgreementABI = zkAgreementJSON.abi;
const zkAgreementInterface = new ethers.Interface(zkAgreementABI)


const calculateCommitment = async (buyer, seller, value, record) => {
    try {
        const input = {
            record: record.split(''),
            nullifier: utils.generateRandomBitString(256).split(''),
        }

        const secretBinary = input.record.join('');
        const secretString = BigInt('0b' + secretBinary).toString();
        const nullifierBinary = input.nullifier.join('');
        const nullifierString = BigInt('0b' + nullifierBinary).toString();

        const absolutePath = path.resolve(recordWasmPath);
        const wasmBuffer = await fs.readFile(absolutePath);
        var record = await wc(wasmBuffer);

        const witnessResult = await record.calculateWitness(input, 0);

        const commitment = witnessResult[1];
        const nullifierHash = witnessResult[2];

        const valueWei = ethers.parseEther(value);
        const unsignedTx = {
            to: zkAgreementAddress,
            from: buyerAddress,
            value: valueWei,
            data: zkAgreementInterface.encodeFunctionData("agreement", [commitment])
        };
        console.log(unsignedTx)

        const tx = await signer.sendTransaction(unsignedTx);
        await tx.wait();

        const txReceipt = await provider.getTransactionReceipt(tx.hash);
        console.log('Transaction Receipt:', txReceipt);

        const log = txReceipt.logs[0];

        const decodedData = zkAgreementInterface.decodeEventLog("Agreement", log.data, log.topics);

        const proofElements = {
            merkleRoot: BigInt(decodedData.root).toString(),
            nullifierHash: nullifierHash.toString(),
            record: secretString,
            nullifier: nullifierString,
            commitment: commitment.toString(),
            hashPairings: decodedData.hashPairings.map((n) => BigInt(n).toString()),
            hashDirections: decodedData.pairDirection.toString(),
            commitmentValue: ethers.formatUnits(decodedData.commitmentValue, "ether").toString(),
            txHash: tx.hash
        };

        console.log("proof elements:", proofElements);
        proofB64 = btoa(JSON.stringify(proofElements));
        fs2.writeFileSync(proofPath, proofB64);

    } catch (e) {
        console.log(e);
    }

}


module.exports = {
    calculateCommitment
};
