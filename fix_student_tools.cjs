const fs = require('fs');
let content = fs.readFileSync('src/components/StudentDocumentCenter.tsx', 'utf8');

const toolsSection = `
      {/* Student Utility Tools Section */}
      <div className="mt-16 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <span className="text-3xl">🛠️</span> Student Document Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo Tools */}
          <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/30 dark:to-pink-950/30 p-6 rounded-3xl border border-fuchsia-100 dark:border-fuchsia-900/50">
            <h3 className="text-lg font-bold text-fuchsia-900 dark:text-fuchsia-400 mb-4 flex items-center gap-2">
              <span className="text-2xl">📸</span> Photo & Signature
            </h3>
            <ul className="space-y-3">
              {['Resize Photo to 50KB', 'Compress Signature', 'Passport Size Photo Maker', 'Convert JPG/PNG'].map((tool, i) => (
                <li key={i}>
                  <button className="w-full text-left px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-fuchsia-500 hover:text-white dark:hover:bg-fuchsia-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-sm flex justify-between items-center group">
                    {tool} <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-fuchsia-200" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Tools */}
          <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/50">
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-400 mb-4 flex items-center gap-2">
              <span className="text-2xl">📑</span> PDF Utilities
            </h3>
            <ul className="space-y-3">
              {['Merge PDF Files', 'Split PDF Pages', 'Compress PDF Size', 'Image to PDF Converter'].map((tool, i) => (
                <li key={i}>
                  <button className="w-full text-left px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-sm flex justify-between items-center group">
                    {tool} <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-200" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Career Tools */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/50">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
              <span className="text-2xl">💼</span> Career & Exam Tools
            </h3>
            <ul className="space-y-3">
              {['Resume / CV Builder', 'Document Checklist', 'DigiLocker Access', 'Typing Speed Test'].map((tool, i) => (
                <li key={i}>
                  <button className="w-full text-left px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-sm flex justify-between items-center group">
                    {tool} <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-200" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
`;

content = content.replace('{/* Disclaimer */}', toolsSection + '\n      {/* Disclaimer */}');
fs.writeFileSync('src/components/StudentDocumentCenter.tsx', content, 'utf8');
