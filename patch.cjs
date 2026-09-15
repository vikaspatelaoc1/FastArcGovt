const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace autoIngestPosts batching logic to handle unlimited chunks
code = code.replace(
  /if \(newStagingJobsList\.length > 0\) \{[\s\S]*?if \(count > 0\) await stageBatch\.commit\(\);\n\s*\}/,
  `if (newStagingJobsList.length > 0) {
        const chunkSize = 400;
        for (let i = 0; i < newStagingJobsList.length; i += chunkSize) {
          const chunk = newStagingJobsList.slice(i, i + chunkSize);
          const stageBatch = writeBatch(firestoreDb);
          for (const sJob of chunk) {
            const stageRef = doc(firestoreDb, 'staging_jobs', sJob.stagingId);
            stageBatch.set(stageRef, sJob, { merge: true });
          }
          await stageBatch.commit();
        }
      }`
);

code = code.replace(
  /if \(newLiveJobsList\.length > 0\) \{[\s\S]*?if \(count > 0\) await liveBatch\.commit\(\);\n\s*\}/,
  `if (newLiveJobsList.length > 0) {
        const chunkSize = 400;
        for (let i = 0; i < newLiveJobsList.length; i += chunkSize) {
          const chunk = newLiveJobsList.slice(i, i + chunkSize);
          const liveBatch = writeBatch(firestoreDb);
          for (const lJob of chunk) {
            const liveRef = doc(firestoreDb, 'jobs', lJob.id);
            liveBatch.set(liveRef, lJob, { merge: true });
          }
          await liveBatch.commit();
        }
      }`
);

fs.writeFileSync('server.ts', code);
console.log('Patched server.ts');
