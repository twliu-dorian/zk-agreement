const crypto = require('crypto');

const prng = {
    generateRandomBitString: (length) => {
        const bytes = crypto.randomBytes(length / 8);
        const bitString = bytes.reduce((acc, byte) => {
            const bits = byte.toString(2).padStart(8, '0');
            return acc + bits;
        }, '');
        return bitString.split('');
    }
};

module.exports = {
    prng
}