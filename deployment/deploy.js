// hardhat deploy script
const hre = require("hardhat");
async function main() {
    // const Hasher = await hre.ethers.getContractFactory("Hasher");
    // const hasher = await Hasher.deploy();
    // await hasher.waitForDeployment();
    // const hasherAddress = await hasher.getAddress();
    // console.log("hasher address:", hasherAddress);

    // const Verifier = await hre.ethers.getContractFactory("Groth16Verifier")
    // const verifier = await Verifier.deploy();
    // await verifier.waitForDeployment();
    // const verifierAddress = await hasher.getAddress();
    // console.log("verifier address:", verifierAddress);

    // deploy agreement, first address is the Hasher, second is the Groth16Verifier
    const ZkAgreement = await hre.ethers.getContractFactory("zkAgreement");
    const zkAgreement = await ZkAgreement.deploy("0x67d269191c92caf3cd7723f116c85e6e9bf55933", "0xe6e340d132b5f46d1e472debcd681b2abc16e57e");
    await zkAgreement.waitForDeployment();
    console.log("agreement address:", await zkAgreement.getAddress());
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});