import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

export type TEnv = 'development' | 'production';

const rawEnv = process.env.NODE_ENV;
const isValidEnv = (env: any): env is TEnv => ['development', 'production'].includes(env);

const NODE_ENV: TEnv = isValidEnv(rawEnv) ? rawEnv : 'development';
const envFileMap: Record<TEnv, string> = {
  development: '.env.development',
  production: '.env.production',
};

const selectedEnvFile = envFileMap[NODE_ENV] ?? '.env';

if (existsSync(selectedEnvFile)) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  dotenv.config({ path: selectedEnvFile });
  console.log(`[env] Loaded: ${selectedEnvFile}`);
} else {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  dotenv.config();
  console.log(`[env] Loaded fallback: .env`);
}

const ENCRYPT_SECRET = process.env.APP_SECRET || '';

if (ENCRYPT_SECRET === '') {
  throw new Error('환경변수 APP_SECRET이 설정되지 않았습니다');
}

export function EncryptUtils(plainText: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(ENCRYPT_SECRET, 'utf8').digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  return 'cipher::' + Buffer.concat([iv, encrypted]).toString('base64');
}

if (require.main === module) {
  const input = process.argv[2];
  if (!input) {
    console.error('암호화할 문자열을 인자로 입력하세요.');
    process.exit(1);
  }

  const encrypted = EncryptUtils(input);
  console.log(`암호화 결과:\n${encrypted}`);
}
