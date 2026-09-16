const fs = require('fs');
let content = fs.readFileSync('src/config/superAdminConfig.ts', 'utf8');

// Add import for Activity if not there
if (!content.includes('Activity,')) {
    content = content.replace('import { ', 'import { Activity, ');
}

// Add the linkHealth module
const newModule = `  {
    id: 'linkHealth',
    label: 'Link Health Checker',
    shortLabel: 'Link Health',
    description: 'Check all job links for broken URLs, validate formats, and manually fix them.',
    icon: Activity,
    category: 'tools',
    categoryLabel: 'Automation Tools',
    color: 'text-orange-400',
    hoverBg: 'hover:bg-orange-950/40',
    tag: 'NEW'
  }
];`;

content = content.replace(/];[\s\n]*export const getSuperAdminModuleById/g, ',\n' + newModule + '\n\nexport const getSuperAdminModuleById');
fs.writeFileSync('src/config/superAdminConfig.ts', content);
console.log('Patched superAdminConfig.ts');
