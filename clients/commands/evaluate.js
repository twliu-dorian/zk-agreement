const fs = require("fs")
const { buyerAddress, sellerAddress, evaluatorAddress, provingSystem, evaluatorWasmPath, zkAgreementAddress } = require("../config.js")
const { utils } = require("../utils/util.js")
const { groth16Evaluator } = require("./groth16.js")
const { plonkEvaluator } = require("./plonk.js")

const evaluateAgreement = async (proofPath, evaluator, ratio) => {

    try {
        const proofString = fs.readFileSync(proofPath, 'utf8');

        const proofElements = JSON.parse(atob(proofString));
        const ratioString = '' + ratio

        const proofInput = {
            "nullifierHash": proofElements.nullifierHash,
            "commitment": proofElements.commitment,
            "root": proofElements.merkleRoot,
            "hashPairings": proofElements.hashPairings,
            "hashDirections": utils.convertToBinaryArray(proofElements.hashDirections),
            "buyer": utils.hexToDecimal(buyerAddress),
            "seller": utils.hexToDecimal(sellerAddress),
            "ratio": ratioString,
            "evaluator": evaluator.split('')
            // "value": String(Math.floor(parseFloat(proofElements.commitmentValue))),
        }
        console.log("proof input:", proofInput)
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