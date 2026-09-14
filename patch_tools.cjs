const fs = require('fs');
let content = fs.readFileSync('src/components/ModernAppView.tsx', 'utf8');

// Replace the grid in TOOLS section with a horizontal slider
const oldGrid = '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">';
const newGrid = '<div className="flex overflow-x-auto no-scrollbar scroll-smooth gap-3 sm:gap-4 pb-2 -mx-3 px-3 sm:-mx-4 sm:px-4 snap-x">';

// We also need to add a fixed width to the tool cards so they don't stretch fully in flex, and can slide.
// And snap-align.
content = content.replace(oldGrid, newGrid);

// Find the tool card class and add widths
const oldCardClass = 'className={`bg-gradient-to-r ${tool.gradient} rounded-2xl p-3.5 sm:p-4 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between group border border-white/10`}';
const newCardClass = 'className={`bg-gradient-to-r ${tool.gradient} rounded-2xl p-3.5 sm:p-4 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between group border border-white/10 w-[240px] sm:w-[280px] shrink-0 snap-start`}';
content = content.replace(oldCardClass, newCardClass);

fs.writeFileSync('src/components/ModernAppView.tsx', content, 'utf8');
