const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\ADMIN\\Desktop\\Belwin-jwells-ERP-Project-main\\Belwin-jwells-ERP-Project-main\\frontend\\src\\pages\\admin\\reports';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // We want to replace the Card and its inner h3 and p with tinted backgrounds and shadows
  // E.g., <Card className="p-6 border-l-4 border-l-green-500 shadow-sm">
  //        <h3 className="text-sm font-semibold text-gray-500 mb-1">...</h3>
  //        <p className="text-3xl font-bold text-gray-800">...</p>
  //      </Card>
  
  const regex = /<Card className="p-6 border-l-4 border-l-([a-z]+)-500 shadow-sm(.*?)">\s*<h3 className="text-sm font-semibold text-gray-500 mb-1">(.*?)<\/h3>\s*<p className="(text-\w+ font-bold text-gray-800.*?|)">(.*?)<\/p>\s*<\/Card>/g;

  const newContent = content.replace(regex, (match, color, extraClasses, title, pClass, value) => {
    changed = true;
    
    // Some values use tracking-tight, let's keep the size but change color and shadow
    let newPClass = pClass.replace('text-gray-800', `text-${color}-900 drop-shadow-md`);
    if (!newPClass.includes('drop-shadow')) {
        newPClass += ' drop-shadow-md';
    }
    // Make text bolder
    newPClass = newPClass.replace('font-bold', 'font-extrabold');

    return `<Card className="p-6 border-l-4 border-l-${color}-500 bg-${color}-50 shadow-md${extraClasses}">
          <h3 className="text-sm font-bold text-${color}-800 mb-1 drop-shadow-sm">${title}</h3>
          <p className="${newPClass}">${value}</p>
        </Card>`;
  });

  if (changed) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', file);
  }
});
