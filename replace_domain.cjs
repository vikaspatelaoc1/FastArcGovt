const fs = require('fs');

const filesToUpdate = [
  'src/components/JobDetailModal.tsx',
  'src/components/AdminPanel.tsx',
  'src/components/AutoFeedContent.tsx',
  'src/components/SeoEditorTab.tsx',
  'src/components/CategorySeoEditorTab.tsx',
  'src/components/Hero.tsx',
  'src/components/JobDetailsPage.tsx',
  'src/data/defaultPages.ts',
  'src/utils/seo.ts',
  'src/App.tsx'
];

filesToUpdate.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Manual precise replacements
  if (file === 'src/components/JobDetailModal.tsx') {
    content = content.replace(/<div>Portal: FastArcGovt\.info<\/div>/g, "<div>Portal: {getDomainName()}</div>");
    content = content.replace(/FastArcGovt\.info — Verified Govt Job/g, "{getDomainName()} — Verified Govt Job");
  }

  if (file === 'src/components/AdminPanel.tsx') {
    content = content.replace(/FastArc Result Official • FastArcGovt\.info/g, "FastArc Result Official • {getDomainName()}");
  }

  if (file === 'src/components/AutoFeedContent.tsx') {
    content = content.replace(/https:\/\/fastarcgovt\.info\/api/g, "https://${getDomainNameLowercase()}/api");
  }

  if (file === 'src/components/SeoEditorTab.tsx') {
    content = content.replace(/https:\/\/fastarcgovt\.info/g, "https://{getDomainNameLowercase()}");
    content = content.replace(/FastArcGovt\.info/g, "{getDomainName()}");
  }

  if (file === 'src/components/CategorySeoEditorTab.tsx') {
    content = content.replace(/https:\/\/fastarcgovt\.info/g, "https://{getDomainNameLowercase()}");
    content = content.replace(/FastArcGovt\.info/g, "{getDomainName()}");
  }

  if (file === 'src/components/Hero.tsx') {
    content = content.replace(/FastArcGovt\.info/g, "{getDomainName()}");
  }

  if (file === 'src/components/JobDetailsPage.tsx') {
    content = content.replace(/FastArcGovt\.info/g, "{getDomainName()}");
  }
  
  if (file === 'src/data/defaultPages.ts') {
    content = content.replace(/fastarcgovt\.info/g, "${getDomainNameLowercase()}");
    content = content.replace(/FastArcGovt\.info/g, "${getDomainName()}");
  }
  
  if (file === 'src/utils/seo.ts') {
    content = content.replace(/"FastArcGovt\.info/g, "`${getDomainName()}");
    content = content.replace(/\| FastArcGovt\.info"/g, "| ${getDomainName()}`");
    content = content.replace(/FastArcGovt\.info"/g, "${getDomainName()}`");
    content = content.replace(/'FastArcGovt\.info'/g, "getDomainName()");
    content = content.replace(/FastArcGovt\.info/g, "${getDomainName()}");
    // fix template string closures
    content = content.replace(/`\$\{getDomainName\(\)\}, Sarkari Result/g, "`${getDomainName()}, Sarkari Result");
    content = content.replace(/`\$\{getDomainName\(\)\} - FastArc/g, "`${getDomainName()} - FastArc");
  }

  if (file === 'src/App.tsx') {
    content = content.replace(/FastArcGovt\.info/g, "{getDomainName()}");
  }

  if (content !== originalContent) {
    // Determine path depth for import
    const depth = file.split('/').length - 2;
    const importPath = depth === 0 ? './utils/domain' : '../utils/domain';
    if (!content.includes('getDomainName')) {
        content = `import { getDomainName, getDomainNameLowercase } from '${importPath}';\n` + content;
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
