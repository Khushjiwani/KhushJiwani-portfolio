const fs = require('fs');
const path = require('path');

const mappings = {
  '#F0F9FF': '#1a1c23', // Dark slate/charcoal background
  '#FFFFFF': '#252830', // Lighter slate for cards
  '#0F172A': '#f1f5f9', // Primary text (slate-50)
  '#475569': '#94a3b8', // Secondary text (slate-400)
  '#0EA5E9': '#5a82a8', // Steel blue accent extracted from photo
  '#38BDF8': '#84a5c6', // Lighter steel blue accent
  'text-black': 'text-[#f1f5f9]' // Fix the hardcoded black text for dark mode
};

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [oldColor, newColor] of Object.entries(mappings)) {
    const regex = new RegExp(oldColor, 'g'); // case sensitive for text-black
    content = content.replace(regex, newColor);
  }
  
  // Also replace case-insensitive hex codes
  for (const [oldColor, newColor] of Object.entries(mappings)) {
    if (oldColor.startsWith('#')) {
      const regex = new RegExp(oldColor, 'gi'); 
      content = content.replace(regex, newColor);
    }
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

replaceInFile(path.join(__dirname, 'src', 'App.tsx'));
replaceInFile(path.join(__dirname, 'src', 'index.css'));
console.log('Colors replaced successfully!');
