const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (f.endsWith('.tsx') || f.endsWith('.jsx')) {
            callback(dirPath);
        }
    });
}

function replacePrefetch(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('prefetch={false}')) {
        const newContent = content.replace(/prefetch=\{false\}/g, 'prefetch={true}');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

const componentDir = path.join(__dirname, 'components');
const appDir = path.join(__dirname, 'app');

if (fs.existsSync(componentDir)) walkDir(componentDir, replacePrefetch);
if (fs.existsSync(appDir)) walkDir(appDir, replacePrefetch);
console.log('Done.');
