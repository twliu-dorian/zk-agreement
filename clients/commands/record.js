const { calculateCommitment } = require("../circuits/commit.js")

const generateRecordCommitment = async (userA, userB, value, secret) => {
    calculateCommitment(userA, userB, value, secret)
}

module.exports = {
    generateRecordCommitment
};
