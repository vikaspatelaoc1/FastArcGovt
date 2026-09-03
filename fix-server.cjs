const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace synchronous Express route handlers with async
code = code.replace(/app\.(get|post|put|delete)\(([^,]+),\s*\(\s*req,\s*res\s*\)\s*=>\s*\{/g, "app.$1($2, async (req, res) => {");

// Replace saveDatabase calls
code = code.replace(/saveDatabase\(/g, "await saveDatabase(");

// Fix potential duplicate awaits
code = code.replace(/await\s+await\s+saveDatabase/g, "await saveDatabase");

fs.writeFileSync('server.ts', code, 'utf8');
console.log('Fixed async handlers and saveDatabase calls.');
