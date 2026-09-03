const fs = require('fs');
if (fs.existsSync('./data/fastarc_database.json')) {
  const stat = fs.statSync('./data/fastarc_database.json');
  console.log('Size of fastarc_database.json:', stat.size);
}
