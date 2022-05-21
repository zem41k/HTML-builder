const fs = require('fs/promises');
const path = require('path');


(async function copyDir() {
    const mkdir = await fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => { if (err) throw err; });
    const readNewDir = await fs.readdir(path.join(__dirname, 'files-copy'));
    if (readNewDir.length !== 0) {
        for (let file of readNewDir) { await fs.rm(path.join(__dirname, '/files-copy', `${file}`), { force: true, recursive: true }) }
    }
    const readDir = await fs.readdir(path.join(__dirname, 'files'));
    for (let file of readDir) { await fs.copyFile(path.join(__dirname, '/files', `${file}`), path.join(__dirname, '/files-copy', `${file}`)); }

})();