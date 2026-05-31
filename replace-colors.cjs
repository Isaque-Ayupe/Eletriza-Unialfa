const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/#141414/g, 'var(--fg)');
  content = content.replace(/#E4E3E0/g, 'var(--bg)');
  content = content.replace(/\bbg-white\b/g, 'bg-[var(--panel)]');
  fs.writeFileSync(file, content);
});
console.log('Done replacing colors.');
