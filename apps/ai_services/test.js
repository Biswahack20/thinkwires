const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isWin = process.platform === 'win32';

// 1. Locate Python virtualenv binary (Windows: venv/Scripts/..., Linux/macOS: venv/bin/...)
const venvPy = isWin
  ? path.join(__dirname, 'venv', 'Scripts', 'python.exe')
  : fs.existsSync(path.join(__dirname, 'venv', 'bin', 'python'))
    ? path.join(__dirname, 'venv', 'bin', 'python')
    : path.join(__dirname, 'venv', 'bin', 'python3');

const venvPytest = isWin
  ? path.join(__dirname, 'venv', 'Scripts', 'pytest.exe')
  : path.join(__dirname, 'venv', 'bin', 'pytest');

// 2. Normalize arguments (convert any Windows backslashes in test paths to forward slashes)
const rawArgs = process.argv.slice(2);
const args = rawArgs.map((arg) => arg.replace(/\\/g, '/'));

// 3. Determine the executable and argument list
let cmd;
let cmdArgs;

if (fs.existsSync(venvPytest)) {
  cmd = venvPytest;
  cmdArgs = args;
} else if (fs.existsSync(venvPy)) {
  cmd = venvPy;
  cmdArgs = ['-m', 'pytest', ...args];
} else {
  // Fallback to system pytest or python
  cmd = isWin ? 'pytest' : 'pytest';
  cmdArgs = args;
}

// 4. Spawn test runner process
const child = spawn(cmd, cmdArgs, {
  stdio: 'inherit',
  cwd: __dirname,
  shell: isWin && !fs.existsSync(cmd),
});

child.on('error', (err) => {
  if (err.code === 'ENOENT') {
    // If pytest command is not in PATH, try python -m pytest
    const fallbackPy = isWin ? 'python' : 'python3';
    console.warn(
      `[ai_services] pytest executable not found. Retrying via '${fallbackPy} -m pytest'...`
    );
    const fallbackChild = spawn(fallbackPy, ['-m', 'pytest', ...args], {
      stdio: 'inherit',
      cwd: __dirname,
      shell: isWin,
    });

    fallbackChild.on('error', (fallbackErr) => {
      console.error(
        '\n❌ [ai_services] Unable to run tests. Python or pytest is not accessible.'
      );
      console.error(
        'Please create the virtual environment and install requirements:'
      );
      console.error(
        '  Windows:       python -m venv venv && .\\venv\\Scripts\\pip install -r requirements.txt'
      );
      console.error(
        '  Linux/macOS:   python3 -m venv venv && ./venv/bin/pip install -r requirements.txt'
      );
      console.error('  Or monorepo:   npm run setup:ai\n');
      process.exit(1);
    });

    fallbackChild.on('exit', (code) => process.exit(code || 0));
    return;
  }

  console.error('[ai_services] Failed to start test runner:', err.message);
  process.exit(1);
});

child.on('exit', (code) => process.exit(code || 0));
