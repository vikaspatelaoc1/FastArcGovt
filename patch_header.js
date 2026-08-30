const fs = require('fs');
const content = fs.readFileSync('src/components/Header.tsx', 'utf8');

const targetStr = `                    <button
                      onClick={() => { setIsDrawerOpen(false); onOpenSuperAdminModal?.('database'); }}`;

const newButton = `                    <button
                      onClick={() => { setIsDrawerOpen(false); onOpenSuperAdminModal?.('versions'); }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#0d1527] hover:bg-[#13203a] text-slate-100 hover:text-amber-300 transition-all cursor-pointer border border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.2)] group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                      <span className="flex items-center gap-2.5 relative z-10"><Settings className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" /> Web Editor & Version Backup</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all relative z-10" />
                    </button>

`;

const patched = content.replace(targetStr, newButton + targetStr);
fs.writeFileSync('src/components/Header.tsx', patched);
console.log('patched header');
