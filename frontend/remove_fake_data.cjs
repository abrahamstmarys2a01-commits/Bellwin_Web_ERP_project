const fs = require('fs');
const path = require('path');

const dir = 'src/pages/admin/reports';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const marker = "// DEMO: Inject fake data if no real data is found";
  let idx = content.indexOf(marker);
  let modified = false;
  
  while (idx !== -1) {
    let startIdx = idx;
    // Find the end of the block. It looks like:
    // if (allLoans.length === 0) { ... allLoans = [ ... ]; }
    // We can use a simple brace matching to find the end of the 'if' statement
    let ifStart = content.indexOf('{', startIdx);
    if (ifStart !== -1) {
        let braces = 1;
        let curr = ifStart + 1;
        while (curr < content.length && braces > 0) {
            if (content[curr] === '{') braces++;
            if (content[curr] === '}') braces--;
            curr++;
        }
        
        // Remove from startIdx to curr (which is just after the closing '}')
        // Also remove the leading whitespace
        let prefixStart = startIdx;
        while (prefixStart > 0 && (content[prefixStart - 1] === ' ' || content[prefixStart - 1] === '\t')) {
            prefixStart--;
        }
        
        // Also remove the trailing newline if any
        if (curr < content.length && (content[curr] === '\n' || content[curr] === '\r')) {
            curr++;
            if (curr < content.length && content[curr] === '\n') curr++;
        }
        
        content = content.substring(0, prefixStart) + content.substring(curr);
        modified = true;
    } else {
        break;
    }
    
    idx = content.indexOf(marker);
  }
  
  if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Processed ${file}`);
  }
});
