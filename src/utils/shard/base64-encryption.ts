import { encode } from 'js-base64';

export function encryptString(password: string) {
  const newDate = Date.now();
  let base64_pwd = `${newDate}_&_${password}`;
  for (let index = 0; index < 2; index++) base64_pwd = encode(base64_pwd);

  return `{2}${base64_pwd}`;
}
