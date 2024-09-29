const snarkJS = require("snarkjs")
const { ethers, JsonRpcProvider } = require("ethers")
const { plonkZkeyPath, evaluatorAddress, evaluatorWasmPath, zkAgreementAddress, evaluatorPrivateKey, apiUrlKey } = require("../config.js")
const { generateProofJSON, generatePublicJSON } = require("../utils/json.js")
const { utils } = require("../utils/util.js")

const signerWallet = new ethers.Wallet(evaluatorPrivateKey);
const provider = new JsonRpcProvider(apiUrlKey);
const signer = signerWallet.connect(provider)
const zkAgreementJSON = require("../../artifacts/contracts/zkAgreement.sol/zkAgreement.json")
const zkAgreementABI = zkAgreementJSON.abi;
const zkAgreementInterface = new ethers.Interface(zkAgreementABI)

const plonkEvaluator = async (proofElements, proofInput) => {
    try {
        const { proof, publicSignals } = await snarkJS.plonk.fullProve(proofInput, evaluatorWasmPath, plonkZkeyPath)
        console.log("zero knowledge proofs:\n", proof)
        console.log("circuit public signals:\n", publicSignals)
        generateProofJSON(proof);
        generatePublicJSON(publicSignals)


        var proofA = proof.A.slice(0, 2).map(utils.BN256ToHex)
        var proofB = proof.B.slice(0, 2).map(utils.BN256ToHex)
        var proofC = proof.C.slice(0, 2).map(utils.BN256ToHex)
        var proofZ = proof.Z.slice(0, 2).map(utils.BN256ToHex)
        var proofT1 = proof.T1.slice(0, 2).map(utils.BN256ToHex)
        var proofT2 = proof.T2.slice(0, 2).map(utils.BN256ToHex)
        var proofT3 = proof.T3.slice(0, 2).map(utils.BN256ToHex)
        var proofWxi = proof.Wxi.slice(0, 2).map(utils.BN256ToHex)
        var proofWxiw = proof.Wxiw.slice(0, 2).map(utils.BN256ToHex)

        var proofInputs = [
            ...proofA, ...proofB, ...proofC, ...proofZ, ...proofT1, ...proofT2, ...proofT3, ...proofWxi, ...proofWxiw,
            utils.BN256ToHex(proof.eval_a),
            utils.BN256ToHex(proof.eval_b),
            utils.BN256ToHex(proof.eval_c),
            utils.BN256ToHex(proof.eval_s1),
            utils.BN256ToHex(proof.eval_s2),
            utils.BN256ToHex(proof.eval_zw),
        ];
        const callInputs = [proofInputs, publicSignals.slice(0, 5).map(utils.BN256ToHex),
            String(Math.floor(parseFloat(proofElements.commitmentValue)))]
        console.log("smart contract call inputs:\n", callInputs)

        const unsignedTx = {
            to: zkAgreementAddress,
            from: evaluatorAddress,
            data: zkAgreementInterface.encodeFunctionData("evaluatePlonk", callInputs)
        };
        const tx = await signer.sendTransaction(unsignedTx);
        await tx.wait();
        const txReceipt = await provider.getTransactionReceipt(tx.hash);
        await provider.destroy();

        return txReceipt;
    } catch (error) {
        console.log(error)
    }

}

function getAllFirstTwoElements(data) {
    const result = [];
    // Loop through each key in the data object
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            // Extract the first two elements from each array
            const [first, second] = data[key];
            // Add them to the result array
            result.push(first, second);
        }
    }
    return result;
}

module.exports = {
    plonkEvaluator
}