// CI parse-gate: fail the build if ANY inline <script> has a syntax error.
// (Upgraded 2026-07-03: previously only the largest script was checked; now the
//  CS-CORE block and every other inline script are gated too.)
const fs = require('fs');
const file = process.argv[2] || (fs.existsSync('hotel-app.html') ? 'hotel-app.html' : 'index.html');
const html = fs.readFileSync(file, 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) { console.error('No inline <script> found in ' + file); process.exit(1); }
let fail = false;
scripts.forEach((js, i) => {
  try { new Function(js); console.log('OK script #' + (i + 1) + ' (' + js.length + ' chars)'); }
  catch (e) { console.error('JS SYNTAX ERROR in ' + file + ' script #' + (i + 1) + ': ' + e.message); fail = true; }
});
process.exit(fail ? 1 : 0);
