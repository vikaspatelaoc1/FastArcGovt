const fs = require('fs');

function replaceInFile(path, replacer) {
  let code = fs.readFileSync(path, 'utf8');
  let newCode = replacer(code);
  if (code !== newCode) {
    fs.writeFileSync(path, newCode);
    console.log('Patched', path);
  }
}

replaceInFile('src/components/AdminPanel.tsx', (code) => {
  if (!code.includes('normalizeExternalUrl')) {
    code = code.replace(/import React, \{ useState, useEffect \} from 'react';/, 
      "import React, { useState, useEffect } from 'react';\nimport { normalizeExternalUrl } from '../utils/urlUtils';");
  }

  // We want to wrap handleSubmit logic to normalize links before saving
  const handleSubmitRegex = /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?try \{/;
  
  if (code.match(handleSubmitRegex)) {
    code = code.replace(handleSubmitRegex, (match) => {
      return `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    // Normalize all links
    const normalizedLinks = { ...formData.links };
    Object.keys(normalizedLinks).forEach(key => {
      if (normalizedLinks[key as keyof typeof normalizedLinks]) {
        normalizedLinks[key as keyof typeof normalizedLinks] = normalizeExternalUrl(normalizedLinks[key as keyof typeof normalizedLinks]);
      }
    });
    
    const finalData = {
      ...formData,
      links: normalizedLinks
    };
    
    try {
      // Temporarily replace formData with finalData for saving
      const dataToSave = { ...finalData, updatedAt: new Date().toISOString() };
      // Replace instances of formData with dataToSave in the save logic below
`;
    });
    
    // Replace formData being passed to onSave
    code = code.replace(/await onSave\(\{\n\s*\.\.\.formData,\n\s*updatedAt: new Date\(\)\.toISOString\(\)\n\s*\}\);/, "await onSave(dataToSave);");
  }
  
  return code;
});
