const fs = require("fs")
const { senderAddress, recipientAddress, evaluatorAddress, provingSystem, evaluatorWasmPath, zkAgreementAddress } = require("../config.js")
const { utils } = require("../utils/util.js")
const { groth16Evaluator } = require("./groth16.js")

const { plonkEvaluator } = require("./plonk.js")
// const { ethers, JsonRpcProvider } = require("ethers")

// const signerWallet = new ethers.Wallet(evaluatorPrivateKey);
// const provider = new JsonRpcProvider(apiUrlKey);
// const signer = signerWallet.connect(provider)


// const zkAgreementJSON = require("../../artifacts/contracts/zkAgreement.sol/zkAgreement.json")
// const zkAgreementABI = zkAgreementJSON.abi;
// const zkAgreementInterface = new ethers.Interface(zkAgreementABI)

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
        });
        var txReceipt;
        console.log(provingSystem)
        if (provingSystem == "groth16") {
            txReceipt = await groth16Evaluator(proofElements, proofInput)
        } else if (provingSystem == "plonk") {
            txReceipt = await plonkEvaluator(proofElements, proofInput)
        }
        console.log('Transaction Receipt:', txReceipt);

        // const { proof, publicSignals } = await snarkJS.groth16.fullProve(proofInput, evaluatorWasmPath, zkeyPath)
        // console.log("zero knowledge proofs:\n", proof)
        // console.log("circuit public signals:\n", publicSignals)
        // generateProofJSON(proof);
        // generatePublicJSON(publicSignals)


        // const callInputs = [
        //     proof.pi_a.slice(0, 2).map(utils.BN256ToHex),
        //     proof.pi_b.slice(0, 2).map((row) => (utils.reverseCoordinate(row.map(utils.BN256ToHex)))),
        //     proof.pi_c.slice(0, 2).map(utils.BN256ToHex),
        //     publicSignals.slice(0, 5).map(utils.BN256ToHex),
        //     proofElements.commitmentValue
        // ];
        // console.log("smart contract call inputs:\n", callInputs)

        // const unsignedTx = {
        //     to: zkAgreementAddress,
        //     from: evaluatorAddress,
        //     data: zkAgreementInterface.encodeFunctionData("evaluate", callInputs)
        // };
        // const tx = await signer.sendTransaction(unsignedTx);
        // await tx.wait();
        // const txReceipt = await provider.getTransactionReceipt(tx.hash);
        // console.log('Transaction Receipt:', txReceipt);
        // await provider.destroy();

    } catch (e) {
        console.log(e);
    } finally {
        process.exit(0);
    }

}

function generateProofJSON(input) {
    const jsonString = JSON.stringify(input, null, 2); // Converts the input object to a JSON string with pretty-printing
    fs.writeFile('proof.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
        // console.log('Successfully wrote proof to proof.json');

    });
}

function generatePublicJSON(inputArray) {
    const jsonString = JSON.stringify(inputArray, null, 2); // Converts the input array to a JSON string with pretty-printing
    fs.writeFile('public.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
    });
}

module.exports = {
    evaluateAgreement
};