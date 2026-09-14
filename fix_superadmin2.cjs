const fs = require('fs');
let content = fs.readFileSync('src/config/superAdminConfig.ts', 'utf8');

content = content.replace("hoverBg: 'hover:bg-green-950/40'\n  }\n  {\n    id: 'documentCenter'", "hoverBg: 'hover:bg-green-950/40'\n  },\n  {\n    id: 'documentCenter'");
fs.writeFileSync('src/config/superAdminConfig.ts', content, 'utf8');
