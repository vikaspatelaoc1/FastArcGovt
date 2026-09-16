const fs = require('fs');
let code = fs.readFileSync('src/utils/jobEnricher.ts', 'utf8');

const regex = /if \(\!\/\^https\?:\\\\\/\\\\\/i\.test\(clean\)\) clean \= \`https:\/\/\$\{clean\}\`;/;

// Let's do a simpler replacement
code = code.replace(
  "if (!/^https?:\\/\\//i.test(clean)) clean = `https://${clean}`;",
  "if (!/^https?:\\/\\//i.test(clean)) clean = `https://${clean}`;\n  \n  // Enforce www. as requested by user\n  clean = clean.replace(/^(https?:\\/\\/)(?!www\\.)(.*)$/i, '$1www.$2');"
);

fs.writeFileSync('src/utils/jobEnricher.ts', code);
console.log('Patched www successfully!');
