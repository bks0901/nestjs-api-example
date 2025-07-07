import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';
import { DecryptUtils } from '@libs/crypto/decrypt-utils';

export default () => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const filename = `${NODE_ENV}.yaml`;
  const configPath = path.resolve(__dirname, filename);
  const file = fs.readFileSync(configPath, 'utf8');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const config = parse(file) as Record<string, any>;
  // const parsed = parse(file) as unknown;
  // const config = parsed as Record<string, any>;

  const secret = process.env.APP_SECRET;
  if (!secret) throw new Error('APP_SECRET 환경변수가 설정되지 않았습니다');

  DecryptUtils.decryptObject(config, secret);
  return config;
};
