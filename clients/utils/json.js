const fs = require("fs")
function generateProofJSON(input) {
    const jsonString = JSON.stringify(input, null, 2); // Converts the input object to a JSON string with pretty-printing
    fs.writeFile('proof.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
        // console.log('Successfully wrote proof to proof.json');

    });
}

function generatePublicJSON(inputArray) {
    const jsonString = JSON.stringify(inputArray, null, 2); // Converts the input array to a JSON string with pretty-printing
    fs.writeFile('public.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        }
    });
}

module.exports = {
    generateProofJSON,
    generatePublicJSON
}