const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("loadDatabase();", "let isDbLoaded = false;");

const middlewareCode = `
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    if (!isDbLoaded) {
      await loadDatabase();
      isDbLoaded = true;
    }
  }
  next();
});
`;

code = code.replace("const app = express();", "const app = express();\n" + middlewareCode);

fs.writeFileSync('server.ts', code, 'utf8');
console.log('Added middleware.');
