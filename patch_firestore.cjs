const fs = require('fs');
let code = fs.readFileSync('src/services/firestoreService.ts', 'utf8');

const regex = /if \(!isClientFirestoreQuotaExceeded\) \{\s*isClientFirestoreQuotaExceeded = true;\s*try \{\s*localStorage\.setItem\(getTodayDateKey\(\), 'true'\);\s*\} catch \{\}\s*console\.warn\(`⚠️ \[Firebase\] Daily write quota reached \(\$\{context \|\| 'operation'\}\)\. All writes safely redirected to local backend storage\.`\);\s*\}/;

const replacement = `if (!isClientFirestoreQuotaExceeded) {
      isClientFirestoreQuotaExceeded = true;
      try {
        localStorage.setItem(getTodayDateKey(), 'true');
      } catch {}
      console.warn(\`⚠️ [Firebase] Daily write quota reached (\${context || 'operation'}). All writes safely redirected to local backend storage.\`);
      
      // Stop the Firestore client from continuously retrying failed writes and overloading the backend / throwing errors.
      try {
        disableNetwork(db).catch(() => {});
      } catch (e) {}
    }`;

const newCode = code.replace(regex, replacement);
if (code === newCode) {
  console.log("No replacement made! Regex mismatch.");
} else {
  fs.writeFileSync('src/services/firestoreService.ts', newCode);
  console.log("Replacement successful!");
}
