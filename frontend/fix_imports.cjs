const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ADMIN/Desktop/Belwin-jwells-ERP-Project-main/Belwin-jwells-ERP-Project-main/frontend/src/pages/admin/loan-config/Loanscheme';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/services\/api/g, '../../../../services/api');
    fs.writeFileSync(filePath, content);
    console.log('Fixed', file);
  }
});
