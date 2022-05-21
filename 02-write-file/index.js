const fs = require('fs');
const path = require('path');
const readline = require('readline');

const stream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), 'utf-8')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log('Hello, print something...');

rl.on('line', (data) => {
    if (data === 'exit') {
        console.log('Bye bye...');
        rl.close();
    } else {
        stream.write(data);
    }
});

rl.on('SIGINT', () => {
    console.log('Bye bye...');
    rl.close();
})

