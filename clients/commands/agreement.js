const { calculateWitness } = require("../circuits/witness.js")

const generateAgreementWitness = async () => {
    calculateWitness()
}

module.exports = {
    generateAgreementWitness
};
