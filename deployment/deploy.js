// hardhat deploy script
const hre = require("hardhat");
async function main() {
    // deploy hasher
    const Hasher = await hre.ethers.getContractFactory("Hasher");
    const hasher = await Hasher.deploy();
    await hasher.waitForDeployment();
    const hasherAddress = hasher.getAddress();
    console.log("hasher address:", hasherAddress);

    // deploy verifier
    const Verifier = await hre.ethers.getContractFactory("Groth16Verifier")
    const verifier = await Verifier.deploy();
    await verifier.waitForDeployment();
    const verifierAddress = hasher.getAddress();
    console.log("verifier address:", verifierAddress);

    // deploy agreement
    const ZkAgreement = await hre.ethers.getContractFactory("zkAgreement");
    const zkAgreement = await ZkAgreement.deploy(hasherAddress, verifierAddress);
    await zkAgreement.waitForDeployment();
    console.log("agreement address:", zkAgreement.getAddress());
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});