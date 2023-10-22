const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getInput(label) {
    let result

    let promise = new Promise((resolve) => {
        rl.question(label, (inputText) => {
            resolve(inputText);
        });
    })

    await promise.then(data => {
        result = data
    });

    return result
}

module.exports = getInput