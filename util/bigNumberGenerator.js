const crypto = require('crypto');

const num = 20;
const length = 256;
async function generate() {
    for (let i = 0; i < num; i++) {
        // Generate random bytes and create a BigNumber from them

        const bytes = crypto.randomBytes(length / 8);
        const bitString = bytes.reduce((acc, byte) => {
            const bits = byte.toString(2).padStart(8, '0');
            return acc + bits;
        }, '');
        console.log(bitString)
        console.log(BigInt(`0b${bitString}`).toString());
    }
}

generate().catch((err) => {
    console.log(err);
    process.exit(1);
});