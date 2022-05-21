const fs = require('fs/promises');
const path = require('path');

(async function createBundle() {
    const readDist = await fs.readdir(path.join(__dirname, '/project-dist',));
    if (readDist.includes('style.css')) await fs.rm(path.join(__dirname, '/project-dist', 'style.css'), { force: true, recursive: true })

    const readdir = await fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
    let styles = [];
    for (file of readdir) {
        if (file.isFile() && path.extname(file.name) === '.css') {
            const readFile = await fs.readFile(path.join(__dirname, '/styles', `${file.name}`), { encoding: 'utf-8' });
            styles.push(readFile);
        };
    };
    const writeFile = await fs.writeFile(path.join(__dirname, '/project-dist', 'bundle.css'), styles.join('\n'));
})();

