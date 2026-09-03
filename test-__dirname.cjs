const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
console.log(code.substring(0, 500));
