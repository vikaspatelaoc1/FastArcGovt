const fs = require('fs');
let content = fs.readFileSync('src/components/StudentDocumentCenter.tsx', 'utf8');

if (!content.includes('StudentDocumentDetail')) {
  // We need to import it
  content = "import { StudentDocumentDetail } from './StudentDocumentDetail';\n" + content;
  
  // Add selected state
  content = content.replace("const [loading, setLoading] = useState(true);", "const [loading, setLoading] = useState(true);\n  const [selectedDoc, setSelectedDoc] = useState<StudentDocument | null>(null);");
  
  // Render logic
  const renderTarget = "return (";
  const renderReplacement = `return selectedDoc ? (
    <StudentDocumentDetail document={selectedDoc} onBack={() => setSelectedDoc(null)} />
  ) : (`;
  
  content = content.replace(renderTarget, renderReplacement);
  
  // Add onClick to card
  const cardTarget = 'className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group flex flex-col h-full"';
  const cardReplacement = 'onClick={() => setSelectedDoc(doc)} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group flex flex-col h-full cursor-pointer"';
  content = content.replace(/className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group flex flex-col h-full"/g, cardReplacement);

  // Stop propagation on links inside card
  content = content.replace(/<a href=\{doc\.officialWebsite\}/g, '<a onClick={(e) => e.stopPropagation()} href={doc.officialWebsite}');
  content = content.replace(/<a href=\{doc\.applyUrl\}/g, '<a onClick={(e) => e.stopPropagation()} href={doc.applyUrl}');
  content = content.replace(/<a href=\{doc\.downloadUrl\}/g, '<a onClick={(e) => e.stopPropagation()} href={doc.downloadUrl}');
  content = content.replace(/<a href=\{doc\.verificationUrl\}/g, '<a onClick={(e) => e.stopPropagation()} href={doc.verificationUrl}');

  fs.writeFileSync('src/components/StudentDocumentCenter.tsx', content, 'utf8');
}
