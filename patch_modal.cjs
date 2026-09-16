const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboardModal.tsx', 'utf8');

if (!content.includes('LinkHealthCheckerTab')) {
    content = content.replace(
        "import { AdminStudentDocuments } from './AdminStudentDocuments';",
        "import { AdminStudentDocuments } from './AdminStudentDocuments';\nimport { LinkHealthCheckerTab } from './LinkHealthCheckerTab';"
    );
}

if (!content.includes("case 'linkHealth':")) {
    content = content.replace(
        "case 'documentCenter':",
        "case 'linkHealth':\n        return <LinkHealthCheckerTab jobs={jobs} setJobs={setJobs} onSaveJob={onSaveJob} onToast={onToast} />;\n      case 'documentCenter':"
    );
}

fs.writeFileSync('src/components/SuperAdminDashboardModal.tsx', content);
console.log('Patched modal');
