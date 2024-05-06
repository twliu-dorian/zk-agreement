// hardhat deploy script
const hre = require("hardhat");
async function main() {
    // deploy hasher
    // const Hasher = await hre.ethers.getContractFactory("Hasher");
    // const hasher = await Hasher.deploy();
    // await hasher.waitForDeployment();
    // const hasherAddress = hasher.getAddress();
    // hasher.addr
    // console.log("hasher address:", hasherAddress);

    // // deploy verifier
    // const Verifier = await hre.ethers.getContractFactory("Groth16Verifier")
    // const verifier = await Verifier.deploy();
    // verifier.deploymentTransaction()
    // await verifier.waitForDeployment();
    // const verifierAddress = hasher.getAddress();
    // console.log("verifier address:", verifierAddress);

    // deploy agreement, first address is the Hasher, second is the Groth16Verifier
    const ZkAgreement = await hre.ethers.getContractFactory("zkAgreement");
    const zkAgreement = await ZkAgreement.deploy("0x7bc06c482dead17c0e297afbc32f6e63d3846650", "0xc351628eb244ec633d5f21fbd6621e1a683b1181");
    await zkAgreement.waitForDeployment();
    console.log("agreement address:", zkAgreement.getAddress());
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});