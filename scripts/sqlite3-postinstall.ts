import { execSync } from 'child_process';
import { mkdirSync, cpSync, existsSync } from 'fs';
import { platform, arch } from 'os';
import * as path from 'path';

function run() {
  const PLATFORM = platform(); // darwin, linux, win32
  const ARCH = arch(); // arm64, x64 등

  // Apple Silicon Mac에서만 실행
  if (!(PLATFORM === 'darwin' && ARCH === 'arm64')) {
    console.log(`Skipping sqlite3 postinstall: current platform is ${PLATFORM}-${ARCH}`);
    return;
  }

  try {
    const sqlite3Path = path.resolve('node_modules/sqlite3');

    console.log('Rebuilding sqlite3 from source for Apple Silicon');
    execSync('node-gyp rebuild --build-from-source --arch=arm64', {
      cwd: sqlite3Path,
      stdio: 'inherit',
    });

    const ABI = process.versions.modules;
    const bindingDir = path.join(sqlite3Path, 'lib', 'binding', `node-v${ABI}-${PLATFORM}-${ARCH}`);

    const buildOutput = path.join(sqlite3Path, 'build', 'Release', 'node_sqlite3.node');

    if (!existsSync(buildOutput)) {
      throw new Error(`Built sqlite3 binary not found at ${buildOutput}`);
    }

    mkdirSync(bindingDir, { recursive: true });
    cpSync(buildOutput, path.join(bindingDir, 'node_sqlite3.node'));

    console.log(`✅ SQLite binding copied to ${bindingDir}`);
  } catch (err: any) {
    const error = err as Error;
    console.error('❌ Failed to postinstall sqlite3:', error.message);
    process.exit(1);
  }
}

run();
