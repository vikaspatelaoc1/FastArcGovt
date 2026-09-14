const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('StudentDocumentCenter')) {
  // We need to import it
  content = "import { StudentDocumentCenter } from './components/StudentDocumentCenter';\n" + content;
  
  // Also we need to add the render condition for 'student-docs'
  const targetStr = "{activeTab === 'admission' && (";
  const replacement = `{activeTab === 'student-docs' && (
              <StudentDocumentCenter />
            )}\n            {activeTab === 'admission' && (`;
  content = content.replace(targetStr, replacement);
  fs.writeFileSync('src/App.tsx', content, 'utf8');
}
