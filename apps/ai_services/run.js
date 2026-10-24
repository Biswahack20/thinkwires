const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isWin = process.platform === 'win32';
const venvPy = isWin
  ? path.join(__dirname, 'venv', 'Scripts', 'python.exe')
  : path.join(__dirname, 'venv', 'bin', 'python');

const pythonExe = fs.existsSync(venvPy) ? venvPy : 'python';
const isDev = process.argv.includes('--dev');
const args = ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8000'];
if (isDev) {
  args.splice(3, 0, '--reload');
}

// Do not use shell: true to prevent space-splitting in paths like C:\Users\Tanjil Alam
const child = spawn(pythonExe, args, { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code || 0));
