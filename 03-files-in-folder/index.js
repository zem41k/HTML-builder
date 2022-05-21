const fs = require('fs');
const path = require('path');

const readdir = fs.readdir(path.join(__dirname, '/secret-folder'), { withFileTypes: true }, (err, files) => {
    if (err) {
        throw err;
    } else {
        files.forEach((file) => {
            if (file.isFile()) {
                let fileName = path.parse(file.name).name;
                let extName = path.extname(file.name).slice(1);
                let fileSize = null;
                fs.stat(path.join(__dirname, '/secret-folder', file.name), (err, stats) => {
                    fileSize = stats.size;
                    console.log(`${fileName} - ${extName} - ${fileSize / 1000} kb`);
                });
            };
        })
    }
});
