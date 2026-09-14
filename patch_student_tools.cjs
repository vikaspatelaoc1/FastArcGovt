const fs = require('fs');
let content = fs.readFileSync('src/components/StudentDocumentCenter.tsx', 'utf8');

const oldGrid = '<div className="grid grid-cols-1 md:grid-cols-3 gap-6">';
const newGrid = '<div className="flex overflow-x-auto no-scrollbar scroll-smooth gap-4 pb-4 -mx-4 px-4 snap-x">';
content = content.replace(oldGrid, newGrid);

const oldCard1 = '<div className="bg-gradient-to-br from-fuchsia-50 to-pink-50';
const newCard1 = '<div className="w-[300px] shrink-0 snap-start bg-gradient-to-br from-fuchsia-50 to-pink-50';
content = content.replace(oldCard1, newCard1);

const oldCard2 = '<div className="bg-gradient-to-br from-rose-50 to-red-50';
const newCard2 = '<div className="w-[300px] shrink-0 snap-start bg-gradient-to-br from-rose-50 to-red-50';
content = content.replace(oldCard2, newCard2);

const oldCard3 = '<div className="bg-gradient-to-br from-blue-50 to-indigo-50';
const newCard3 = '<div className="w-[300px] shrink-0 snap-start bg-gradient-to-br from-blue-50 to-indigo-50';
content = content.replace(oldCard3, newCard3);

fs.writeFileSync('src/components/StudentDocumentCenter.tsx', content, 'utf8');
