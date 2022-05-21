const fs = require('fs/promises');
const path = require('path');
const fsStream = require('fs');

async function createNewDir() {
    const mkdir = await fs.mkdir(path.join(__dirname, '/project-dist', '/assets'), { recursive: true }, (err) => { if (err) throw err; });
    const readNewDir = await fs.readdir(path.join(__dirname, '/project-dist', '/assets'));
    if (readNewDir.length !== 0) {
        for (let item of readNewDir) { await fs.rm(path.join(__dirname, '/project-dist', '/assets', `${item}`), { force: true, recursive: true }) }
    }
}

async function copyDir(dirPath) {
    const readDir = await fs.readdir(path.join(__dirname, `${dirPath}`), { withFileTypes: true });
    for (let item of readDir) {
        if (!item.isFile()) {
            await fs.mkdir(path.join(__dirname, '/project-dist', `${dirPath}/${item.name}`), { recursive: true }, (err) => { if (err) throw err; });
            await copyDir(`${dirPath}/${item.name}`)
        } else {
            await fs.copyFile(path.join(__dirname, `${dirPath}`, `${item.name}`), path.join(__dirname, '/project-dist', `${dirPath}`, `${item.name}`))
        }
    }
};

async function createBundle() {
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
    const writeFile = await fs.writeFile(path.join(__dirname, '/project-dist', 'style.css'), styles.join('\n'));
};

async function changeHTML() {
    const readStream = fsStream.createReadStream(path.join(__dirname, 'template.html'), { encoding: 'utf-8' });
    const writeStream = fsStream.createWriteStream(path.join(__dirname, '/project-dist', 'index.html'));
    readStream.pipe(writeStream);

    let components = {};
    const componentsDir = await fs.readdir(path.join(__dirname, '/components'));
    for (item of componentsDir) components[path.parse(item).name] = await fs.readFile(path.join(__dirname, '/components', `${item}`), { encoding: 'utf-8' });
    const componentsNames = Object.keys(components);

    let readNewIndex = await fs.readFile(path.join(__dirname, '/project-dist', 'index.html'), { encoding: 'utf-8' });
    for (item of componentsNames) readNewIndex = readNewIndex.replace(`{{${item}}}`, components[item]);
    const writeNewIndex = await fs.writeFile(path.join(__dirname, '/project-dist', 'index.html'), readNewIndex);

}

(async function buildPage() {
    await createNewDir();
    await copyDir('assets');
    await createBundle();
    await changeHTML();
})();