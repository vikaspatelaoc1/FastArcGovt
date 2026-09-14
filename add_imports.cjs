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

  // Determine path depth for import
  const depth = file.split('/').length - 2;
  const importPath = depth === 0 ? './utils/domain' : '../utils/domain';
  
  // check if import is there
  if (!content.includes("from '../utils/domain'") && !content.includes("from './utils/domain'")) {
      content = `import { getDomainName, getDomainNameLowercase } from '${importPath}';\n` + content;
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
  }
});
