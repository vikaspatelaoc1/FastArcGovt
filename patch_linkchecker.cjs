const fs = require('fs');

const adminPanelPath = 'src/components/AdminPanel.tsx';
let code = fs.readFileSync(adminPanelPath, 'utf8');

if (!code.includes('Link Health Checker')) {
  // Let's inject a simple link health checker tab
  // But wait, the prompt asks for "Link Health Checker module/card" in Super Admin Panel.
  // We can add a "Link Health Checker" tab.

  const replacement = `
// --- Link Health Checker ---
function LinkHealthChecker({ jobs }: { jobs: Job[] }) {
  const [links, setLinks] = useState<{jobName: string, type: string, url: string, status: string}[]>([]);
  
  useEffect(() => {
    const allLinks: {jobName: string, type: string, url: string, status: string}[] = [];
    jobs.forEach(job => {
      if (job.links) {
        Object.entries(job.links).forEach(([key, url]) => {
          if (url && typeof url === 'string' && url.trim() !== '') {
            let status = '✅ Valid';
            if (!/^https?:\/\//i.test(url)) status = '⚠️ Invalid Format';
            else if (url.includes('https://https://')) status = '⚠️ Invalid Format';
            else if (url.trim() === '#') status = '❌ Broken';
            
            allLinks.push({ jobName: job.title, type: key, url, status });
          }
        });
      }
    });
    setLinks(allLinks);
  }, [jobs]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Link Health Checker</h3>
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.map((l, i) => (
              <tr key={i} className={l.status.includes('Valid') ? '' : 'bg-red-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{l.jobName.substring(0, 30)}...</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{l.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 truncate max-w-xs">{l.url}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// -----------------------------

`;

  code = code.replace(/export function AdminPanel\(\{/, replacement + '\nexport function AdminPanel({');
  
  // Add it to the render output of AdminPanel
  code = code.replace(/<\/div>\n\s*<\/div>\n\s*\);/, `  <LinkHealthChecker jobs={jobs} />\n      </div>\n    </div>\n  );`);
  
  fs.writeFileSync(adminPanelPath, code);
  console.log('Added Link Health Checker');
}
