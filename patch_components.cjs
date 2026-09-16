const fs = require('fs');

function replaceInFile(path, replacer) {
  let code = fs.readFileSync(path, 'utf8');
  let newCode = replacer(code);
  if (code !== newCode) {
    fs.writeFileSync(path, newCode);
    console.log('Patched', path);
  }
}

replaceInFile('src/components/JobDetailsPage.tsx', (code) => {
  if (!code.includes('SafeExternalLink')) {
    code = code.replace(/import \{ (.*?) \} from '\.\.\/utils\/jobEnricher';/, 
      "import { $1 } from '../utils/jobEnricher';\nimport { SafeExternalLink } from './SafeExternalLink';");
  }

  // Find all <a href={...} ...> ... </a> that use job.links
  // Since we already enriched them, job.links.* are already cleaned by cleanOfficialUrl in jobEnricher.
  // But to be completely safe and use the SafeExternalLink component, we can replace:
  // <a href={job.links.someLink} ...> with <SafeExternalLink url={job.links.someLink} ...>
  
  // We can just use a regex for all <a ... href={job.links...} ...>
  // Let's replace any <a href={job.links.[a-zA-Z]+}
  const regex = /<a(\s+[^>]*?)href=\{(job\.links\.[a-zA-Z0-9_]+)\}([^>]*?)>([\s\S]*?)<\/a>/g;
  code = code.replace(regex, (match, beforeHref, urlArg, afterHref, inner) => {
    let attrs = beforeHref + afterHref;
    let cleanAttrs = attrs
      .replace(/\s+target="_blank"/g, '')
      .replace(/\s+rel="noopener noreferrer"/g, '')
      .replace(/\s+rel="noreferrer"/g, '');
    
    // Some places use ExternalLink icon inside inner, we can remove it since SafeExternalLink has it,
    // or keep it and set showIcon={false}. We'll set showIcon={false} to not double up the icon, 
    // unless they don't have it.
    let showIcon = !inner.includes('<ExternalLink');
    if (!showIcon) {
      // Actually let's just strip the internal <ExternalLink> and use the standard one
      inner = inner.replace(/<ExternalLink[^>]*\/>/g, '');
      showIcon = true;
    }
    
    return `<SafeExternalLink url={${urlArg}}${cleanAttrs} showIcon={${showIcon}}>${inner}</SafeExternalLink>`;
  });
  
  return code;
});
