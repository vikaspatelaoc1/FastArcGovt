const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            <div className="min-w-0">
              <h4 className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-tight truncate leading-none">
                {columnConfigs['important']?.title || 'Important'}
              </h4>
              <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight mt-0.5">{counts.important}</p>
            </div>
          </div>`;
          
const replacement = target + `
          
          <div onClick={() => handleTabChange('student-docs')} className={\`bg-blue-50/80 dark:bg-blue-950/20 border \${activeTab === 'student-docs' ? 'border-blue-400 dark:border-blue-500 shadow-sm ring-1 ring-blue-200 dark:ring-blue-900/50' : 'border-blue-100/80 dark:border-blue-900/40'} rounded-xl py-1.5 px-2 sm:py-2 sm:px-2.5 flex items-center space-x-2 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-700\`}>
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden p-0.5 shrink-0 shadow-xs">
              <span className="text-sm">🛠️</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-tight truncate leading-none">
                Document Tools
              </h4>
              <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight mt-0.5">3+</p>
            </div>
          </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content, 'utf8');
