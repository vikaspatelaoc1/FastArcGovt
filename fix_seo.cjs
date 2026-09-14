const fs = require('fs');

let content = fs.readFileSync('src/utils/seo.ts', 'utf8');

content = content.replace(/siteTitle: `\$\{getDomainName\(\)\} \| FastArc Govt Result - Latest Online Form, Admit Card & Results 2026",/g, "siteTitle: `${getDomainName()} | FastArc Govt Result - Latest Online Form, Admit Card & Results 2026`,");
content = content.replace(/metaDescription: `\$\{getDomainName\(\)\} - FastArc Government Jobs Portal: Get instant updates for latest Sarkari Naukri, Online Forms, Admit Cards, Exam Results, Answer Keys, Syllabus & Admissions 2026\.",/g, "metaDescription: `${getDomainName()} - FastArc Government Jobs Portal: Get instant updates for latest Sarkari Naukri, Online Forms, Admit Cards, Exam Results, Answer Keys, Syllabus & Admissions 2026.`,");
content = content.replace(/metaKeywords: `\$\{getDomainName\(\)\}, Sarkari Result, Govt Jobs 2026, Latest Online Form, Admit Card, Exam Results, Answer Key, FastArc, Recruitment Notification",/g, "metaKeywords: `${getDomainName()}, Sarkari Result, Govt Jobs 2026, Latest Online Form, Admit Card, Exam Results, Answer Key, FastArc, Recruitment Notification`,");
content = content.replace(/authorName: `\$\{getDomainName\(\)\}",/g, "authorName: `${getDomainName()}`,");

fs.writeFileSync('src/utils/seo.ts', content, 'utf8');
