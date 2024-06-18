const snarkJS = require("snarkjs")
const { ethers, JsonRpcProvider } = require("ethers")
const { groth16ZkeyPath, evaluatorAddress, evaluatorWasmPath, zkAgreementAddress, evaluatorPrivateKey, apiUrlKey } = require("../config.js")
const { generateProofJSON, generatePublicJSON } = require("../utils/json.js")
const { utils } = require("../utils/util.js")

const signerWallet = new ethers.Wallet(evaluatorPrivateKey);
const provider = new JsonRpcProvider(apiUrlKey);
const signer = signerWallet.connect(provider)
const zkAgreementJSON = require("../../artifacts/contracts/zkAgreement.sol/zkAgreement.json")
const zkAgreementABI = zkAgreementJSON.abi;
const zkAgreementInterface = new ethers.Interface(zkAgreementABI)

const groth16Evaluator = async (proofElements, proofInput) => {
    try {
        const { proof, publicSignals } = await snarkJS.groth16.fullProve(proofInput, evaluatorWasmPath, groth16ZkeyPath)
        console.log("zero knowledge proofs:\n", proof)
        console.log("circuit public signals:\n", publicSignals)
        generateProofJSON(proof);
        generatePublicJSON(publicSignals)


        const callInputs = [
            proof.pi_a.slice(0, 2).map(utils.BN256ToHex),
            proof.pi_b.slice(0, 2).map((row) => (utils.reverseCoordinate(row.map(utils.BN256ToHex)))),
            proof.pi_c.slice(0, 2).map(utils.BN256ToHex),
            publicSignals.slice(0, 5).map(utils.BN256ToHex),
            proofElements.commitmentValue
        ];
        console.log("smart contract call inputs:\n", callInputs)

        const unsignedTx = {
            to: zkAgreementAddress,
            from: evaluatorAddress,
            data: zkAgreementInterface.encodeFunctionData("evaluateGroth16", callInputs)
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

module.exports = {
    groth16Evaluator
}