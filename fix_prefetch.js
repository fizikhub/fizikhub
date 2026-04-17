const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (f === 'node_modules' || f === '.next' || f === '.git') return;
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? files = files.concat(walkDir(dirPath)) : files.push(dirPath);
    });
    return files;
}

let allFiles = walkDir('.');
let tsConfig = allFiles.filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
let count = 0;

tsConfig.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('prefetch={false}')) {
        content = content.replace(/prefetch={false}/g, '');
        fs.writeFileSync(f, content);
        count++;
    }
});
console.log(`Removed prefetch={false} from ${count} files!`);
