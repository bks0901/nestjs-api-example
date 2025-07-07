import * as crypto from 'crypto';

export class DecryptUtils {
  private static readonly algorithm = 'aes-256-cbc';
  private static readonly ivLength = 16;
  private static readonly prefix = 'cipher::';

  static decrypt(encryptedText: string, secret: string): string {
    try {
      // prefix 확인 후 제거
      const base64 = encryptedText.startsWith(this.prefix)
        ? encryptedText.slice(this.prefix.length)
        : encryptedText;

      const encrypted = Buffer.from(base64, 'base64');
      if (encrypted.length <= this.ivLength) {
        throw new Error('iv를 포함한 암호문 형식이 아닙니다');
      }

      const iv = encrypted.subarray(0, this.ivLength);
      const data = encrypted.subarray(this.ivLength);

      const key = crypto.createHash('sha256').update(secret, 'utf8').digest();
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

      return decrypted.toString('utf8');
    } catch (err) {
      const error = err as Error;
      console.error('복호화 실패:', error.message ?? err);
      throw error;
    }
  }

  static decryptObject(obj: Record<string, any>, secret: string): void {
    Object.keys(obj).forEach((key) => {
      const value: unknown = obj[key];

      if (typeof value === 'object' && value !== null) {
        this.decryptObject(value, secret);
      } else if (typeof value === 'string' && value.startsWith(this.prefix)) {
        const encrypted = value.substring(this.prefix.length);
        obj[key] = this.decrypt(encrypted, secret);
      }
    });
  }
}
