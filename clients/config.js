require('dotenv').config();

module.exports = {
    zkAgreementAddress: process.env.ZK_AGREEMENT_ADDRESS,
    senderPrivateKey: process.env.SENDER_PRIVATE_KEY,
    senderAddress: process.env.SENDER_ADDRESS,
    recipientAddress: process.env.RECIPIENT_ADDRESS,
    evaluatorPrivateKey: process.env.EVALUATOR_PRIVATE_KEY,
    evaluatorAddress: process.env.EVALUATOR_ADDRESS,
    evaluatorWasmPath: process.env.EVALUATOR_WASM_PATH,
    agreementWasmPath: process.env.AGREEMENT_WASM_PATH,
    proofPath: process.env.PROOF_PATH,
    apiUrlKey: process.env.API_URL_KEY,
    provingSystem: process.env.PROVING_SYSTEM,
    groth16ZkeyPath: process.env.GROTH16_ZKEY_PATH,
    plonkZkeyPath: process.env.PLONK_ZKEY_PATH
};

