// hardhat deploy script
const hre = require("hardhat");
async function main() {
    // deploy hasher
    const Hasher = await hre.ethers.getContractFactory("Hasher");
    const hasher = await Hasher.deploy();

    await hasher.waitForDeployment();
    console.log(hasher.address);

    const hasherAddress = hasher.getAddress();

    // deploy tornado
    const ZkAgreement = await hre.ethers.getContractFactory("zkAgreement");
    const zkAgreement = await ZkAgreement.deploy(hasherAddress, "0x27DE3fd75B0540DB22E41038ac692116e0dfea0B");
    await zkAgreement.waitForDeployment();
    console.log(zkAgreement.getAddress());
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});