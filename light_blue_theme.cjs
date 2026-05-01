const fs = require('fs');
const path = require('path');

const mappings = {
  '#F8FAFC': '#F0F9FF', // Light blue background (sky-50)
  '#2563EB': '#0EA5E9', // Primary light blue accent (sky-500)
  '#6366F1': '#38BDF8', // Secondary light blue accent (sky-400)
};

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [oldColor, newColor] of Object.entries(mappings)) {
    const regex = new RegExp(oldColor, 'gi');
    content = content.replace(regex, newColor);
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

replaceInFile(path.join(__dirname, 'src', 'App.tsx'));
replaceInFile(path.join(__dirname, 'src', 'index.css'));
console.log('Colors replaced successfully!');
