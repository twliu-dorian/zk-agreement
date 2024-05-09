const { calculateWitness } = require("../circuits/witness.js")

const generateAgreementWitness = async (userA, userB, value, secret) => {
    calculateWitness(userA, userB, value, secret)
}

module.exports = {
    generateAgreementWitness
};
