const fs = require('fs');

let content = fs.readFileSync('src/utils/seo.ts', 'utf8');

// fix const siteName = `${getDomainName()}";
content = content.replace(/const siteName = `\$\{getDomainName\(\)\}";/g, "const siteName = getDomainName();");
// fix const siteName = "`${getDomainName()}";
content = content.replace(/const siteName = "\`\$\{getDomainName\(\)\}";/g, "const siteName = getDomainName();");

// Fix any other `getDomainName()` syntax errors in seo.ts
content = content.replace(/"\$\{getDomainName\(\)\}/g, "`${getDomainName()}");
content = content.replace(/\$\{getDomainName\(\)\}"/g, "${getDomainName()}`");

fs.writeFileSync('src/utils/seo.ts', content, 'utf8');
