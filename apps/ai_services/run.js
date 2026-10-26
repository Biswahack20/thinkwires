const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isWin = process.platform === 'win32';
const venvPy = isWin
  ? path.join(__dirname, 'venv', 'Scripts', 'python.exe')
  : fs.existsSync(path.join(__dirname, 'venv', 'bin', 'python'))
    ? path.join(__dirname, 'venv', 'bin', 'python')
    : path.join(__dirname, 'venv', 'bin', 'python3');

const systemPy = isWin ? 'python' : 'python3';
const pythonExe = fs.existsSync(venvPy) ? venvPy : systemPy;

const isDev = process.argv.includes('--dev');
const args = [
  '-m',
  'uvicorn',
  'main:app',
  '--host',
  '0.0.0.0',
  '--port',
  '8000',
];
if (isDev) {
  args.splice(3, 0, '--reload');
}

// Ensure execution directory is apps/ai_services and avoid shell: true to prevent space-splitting
const child = spawn(pythonExe, args, { stdio: 'inherit', cwd: __dirname });

child.on('error', (err) => {
  console.error(
    `\n❌ [ai_services] Failed to start Python runtime with '${pythonExe}': ${err.message}`
  );
  console.error('Please verify that Python 3 and requirements are set up:');
  console.error(
    '  Windows:       python -m venv venv && .\\venv\\Scripts\\pip install -r requirements.txt'
  );
  console.error(
    '  Linux/macOS:   python3 -m venv venv && ./venv/bin/pip install -r requirements.txt'
  );
  console.error('  Or monorepo:   npm run setup:ai\n');
  process.exit(1);
});

child.on('exit', (code) => process.exit(code || 0));
