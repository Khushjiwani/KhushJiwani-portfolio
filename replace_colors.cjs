const fs = require('fs');
const path = require('path');

const mappings = {
  '#fafafa': '#F8FAFC', // Light background (slate-50)
  '#ffffff': '#FFFFFF', // White background
  '#264653': '#0F172A', // Primary text and borders (slate-900)
  '#2a9d8f': '#475569', // Secondary text (slate-600)
  '#e76f51': '#2563EB', // Accent 1: Professional Blue (blue-600)
  '#e9c46a': '#6366F1', // Accent 2: Indigo (indigo-500)
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
