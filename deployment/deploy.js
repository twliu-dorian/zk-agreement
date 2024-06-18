// hardhat deploy script
const hre = require("hardhat");
async function main() {
    const Hasher = await hre.ethers.getContractFactory("Hasher");
    const hasher = await Hasher.deploy();
    await hasher.waitForDeployment();
    const hasherAddress = await hasher.getAddress();
    console.log("hasher address:", hasherAddress);

    const groth16Verifier = await hre.ethers.getContractFactory("Groth16Verifier")
    const groth16verifier = await groth16Verifier.deploy();
    await groth16verifier.waitForDeployment();
    const groth16VerifierAddress = await groth16verifier.getAddress();
    console.log("groth16 Verifier address:", groth16VerifierAddress);

    const plonkVerifier = await hre.ethers.getContractFactory("PlonkVerifier")
    const plonkverifier = await plonkVerifier.deploy();
    await plonkverifier.waitForDeployment();
    const plonkVerifierAddress = await plonkverifier.getAddress();
    console.log("plonk Verifier address:", plonkVerifierAddress);

    // deploy agreement, first address is the Hasher, second is the Groth16Verifier
    const ZkAgreement = await hre.ethers.getContractFactory("zkAgreement");
    const zkAgreement = await ZkAgreement.deploy(hasherAddress, groth16VerifierAddress, plonkVerifierAddress);
    await zkAgreement.waitForDeployment();
    console.log("agreement address:", await zkAgreement.getAddress());
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});