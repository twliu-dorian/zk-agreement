const fs = require("fs")
const snarkJS = require("snarkjs")
const { senderAddress, recipientAddress, evaluatorAddress, zkeyPath, evaluatorWasmPath, zkAgreementAddress, evaluatorPrivateKey, apiUrlKey } = require("../config.js")
const { utils } = require("../utils/util.js")

const { ethers, JsonRpcProvider } = require("ethers")

const signerWallet = new ethers.Wallet(evaluatorPrivateKey);
const provider = new JsonRpcProvider(apiUrlKey);
const signer = signerWallet.connect(provider)


const zkagreementJSON = require("../../artifacts/contracts/zkAgreement.sol/zkAgreement.json")
const zkAgreementABI = zkagreementJSON.abi;
const zkAgreementInterface = new ethers.Interface(zkAgreementABI)

const evaluateAgreement = async (proofPath, evaluator, result) => {

    try {
        const proofString = fs.readFileSync(proofPath, 'utf8');

        const proofElements = JSON.parse(atob(proofString));
        const resultString = '' + result

        const proofInput = {
            "root": proofElements.merkleRoot,
            "nullifierHash": proofElements.nullifierHash,
            "commitment": proofElements.commitment,
            "sender": utils.hexToDecimal(senderAddress),
            "recipient": utils.hexToDecimal(recipientAddress),
            "result": resultString,
            "evaluator": evaluator.split(''),
            "hashPairings": proofElements.hashPairings,
            "hashDirections": utils.convertToBinaryArray(proofElements.hashDirections)
        }
        console.log(proofInput)
        const jsonData = JSON.stringify(proofInput, null, 2);

        fs.writeFile('evaluator_js/input.json', jsonData, (err) => {
            if (err) {
                console.error('An error occurred:', err);
                return;
            }
            console.log('JSON data has been written to data.json successfully.');
        });


        const { proof, publicSignals } = await snarkJS.groth16.fullProve(proofInput, evaluatorWasmPath, zkeyPath)

        const callInputs = [
            proof.pi_a.slice(0, 2).map(utils.BN256ToHex),
            proof.pi_b.slice(0, 2).map((row) => (utils.reverseCoordinate(row.map(utils.BN256ToHex)))),
            proof.pi_c.slice(0, 2).map(utils.BN256ToHex),
            publicSignals.slice(0, 5).map(utils.BN256ToHex),
            proofElements.commitmentValue
        ];
        console.log(callInputs)

        const unsignedTx = {
            to: zkAgreementAddress,
            from: evaluatorAddress,
            data: zkAgreementInterface.encodeFunctionData("evaluate", callInputs)
        };
        const tx = await signer.sendTransaction(unsignedTx);
        await tx.wait();
        const txReceipt = await provider.getTransactionReceipt(tx.hash);
        console.log('Transaction Receipt:', txReceipt);
        await provider.destroy();

    } catch (e) {
        console.log(e);
    } finally {
        provider.removeAllListeners();
        process.exit(0);
    }

}

module.exports = {
    evaluateAgreement
};