const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboardModal.tsx', 'utf8');

if (!content.includes('AdminStudentDocuments')) {
  // We need to import it
  content = "import { AdminStudentDocuments } from './AdminStudentDocuments';\n" + content;
  fs.writeFileSync('src/components/SuperAdminDashboardModal.tsx', content, 'utf8');
}
