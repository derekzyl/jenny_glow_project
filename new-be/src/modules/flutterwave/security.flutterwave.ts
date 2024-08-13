import md5 from 'md5';
import * as forge from 'node-forge';
import createHash from 'sha.js';

// This is the getKey function that generates an encryption Key
// for you by passing your Secret Key as a parameter.
export function getEncryptionKey(secretKey: string): string {
  const keymd5 = md5(secretKey);
  const keymd5last12 = keymd5.slice(-12); // .substr(-12);

  const seckeyadjusted = secretKey.replace('FLWSECK-', '');
  const seckeyadjustedfirst12 = seckeyadjusted.substring(0, 12); // .substr(0, 12);

  return seckeyadjustedfirst12 + keymd5last12;
}

// This is the encryption function that encrypts your payload
// by passing the stringified format and your encryption Key.
export function encrypt(key: string, text: string): string {
  const cipher = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(key));
  cipher.start({ iv: '' });
  cipher.update(forge.util.createBuffer(text, 'utf8'));
  cipher.finish();
  const encrypted = cipher.output;
  return forge.util.encode64(encrypted.getBytes());
}

export function getIntegrityHash(data: Record<string, any>, _: any, secretKey: string): string {
  const objectKeys = Object.keys(data)
    .filter((ok) => ok !== 'integrity_hash')
    .sort();
  let hashString = '';
  objectKeys.forEach((ok) => {
    hashString += data[ok];
  });
  hashString += secretKey;
  const hash = createHash('sha256').update(hashString, 'utf8').digest('hex');
  return hash;
}
