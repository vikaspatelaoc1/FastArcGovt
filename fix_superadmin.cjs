const fs = require('fs');
let content = fs.readFileSync('src/config/superAdminConfig.ts', 'utf8');

const newModule = `
  {
    id: 'documentCenter',
    label: 'Document Center Management',
    shortLabel: 'Student Docs',
    description: 'Manage student document services, verification links, and tools.',
    icon: Database, // Will change later if FileText is imported
    category: 'content',
    categoryLabel: 'Content & Updates',
    color: 'text-indigo-500',
    hoverBg: 'hover:bg-indigo-950/40',
    tag: 'NEW'
  }
];`;

content = content.replace(/\];/g, newModule);
fs.writeFileSync('src/config/superAdminConfig.ts', content, 'utf8');
