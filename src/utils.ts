/**
 * Pure JavaScript MD5 hash generator (lightweight & self-contained)
 */
export function md5(string: string): string {
  function rotl(n: number, c: number) {
    return (n << c) | (n >>> (32 - c));
  }
  function md5_cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return rotl((a + q + x + t) | 0, s) + b | 0;
  }
  function md5_ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5_gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5_hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  const k = [], r = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  for (let i = 0; i < 64; i++) {
    k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
  }

  const x = [];
  const str = unescape(encodeURIComponent(string));
  const len = str.length;
  let h0 = 1732584193, h1 = -271733879, h2 = -1732584194, h3 = 271733878;

  for (let i = 0; i < len; i++) {
    x[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  }
  x[len >> 2] |= 0x80 << ((len % 4) * 8);
  x[(((len + 8) >> 6) << 4) + 14] = len * 8;

  for (let j = 0; j < x.length; j += 16) {
    let a = h0, b = h1, c = h2, d = h3;

    a = md5_ff(a, b, c, d, x[j + 0], 7, k[0]); d = md5_ff(d, a, b, c, x[j + 1], 12, k[1]); c = md5_ff(c, d, a, b, x[j + 2], 17, k[2]); b = md5_ff(b, c, d, a, x[j + 3], 22, k[3]);
    a = md5_ff(a, b, c, d, x[j + 4], 7, k[4]); d = md5_ff(d, a, b, c, x[j + 5], 12, k[5]); c = md5_ff(c, d, a, b, x[j + 6], 17, k[6]); b = md5_ff(b, c, d, a, x[j + 7], 22, k[7]);
    a = md5_ff(a, b, c, d, x[j + 8], 7, k[8]); d = md5_ff(d, a, b, c, x[j + 9], 12, k[9]); c = md5_ff(c, d, a, b, x[j + 10], 17, k[10]); b = md5_ff(b, c, d, a, x[j + 11], 22, k[11]);
    a = md5_ff(a, b, c, d, x[j + 12], 7, k[12]); d = md5_ff(d, a, b, c, x[j + 13], 12, k[13]); c = md5_ff(c, d, a, b, x[j + 14], 17, k[14]); b = md5_ff(b, c, d, a, x[j + 15], 22, k[15]);

    a = md5_gg(a, b, c, d, x[j + 1], 5, k[16]); d = md5_gg(d, a, b, c, x[j + 6], 9, k[17]); c = md5_gg(c, d, a, b, x[j + 11], 14, k[18]); b = md5_gg(b, c, d, a, x[j + 0], 20, k[19]);
    a = md5_gg(a, b, c, d, x[j + 5], 5, k[20]); d = md5_gg(d, a, b, c, x[j + 10], 9, k[21]); c = md5_gg(c, d, a, b, x[j + 15], 14, k[22]); b = md5_gg(b, c, d, a, x[j + 4], 20, k[23]);
    a = md5_gg(a, b, c, d, x[j + 9], 5, k[24]); d = md5_gg(d, a, b, c, x[j + 14], 9, k[25]); c = md5_gg(c, d, a, b, x[j + 3], 14, k[26]); b = md5_gg(b, c, d, a, x[j + 8], 20, k[27]);
    a = md5_gg(a, b, c, d, x[j + 13], 5, k[28]); d = md5_gg(d, a, b, c, x[j + 2], 9, k[29]); c = md5_gg(c, d, a, b, x[j + 7], 14, k[30]); b = md5_gg(b, c, d, a, x[j + 12], 20, k[31]);

    a = md5_hh(a, b, c, d, x[j + 5], 4, k[32]); d = md5_hh(d, a, b, c, x[j + 8], 11, k[33]); c = md5_hh(c, d, a, b, x[j + 11], 16, k[34]); b = md5_hh(b, c, d, a, x[j + 14], 23, k[35]);
    a = md5_hh(a, b, c, d, x[j + 1], 4, k[36]); d = md5_hh(d, a, b, c, x[j + 4], 11, k[37]); c = md5_hh(c, d, a, b, x[j + 7], 16, k[38]); b = md5_hh(b, c, d, a, x[j + 10], 23, k[39]);
    a = md5_hh(a, b, c, d, x[j + 13], 4, k[40]); d = md5_hh(d, a, b, c, x[j + 0], 11, k[41]); c = md5_hh(c, d, a, b, x[j + 3], 16, k[42]); b = md5_hh(b, c, d, a, x[j + 6], 23, k[43]);
    a = md5_hh(a, b, c, d, x[j + 9], 4, k[44]); d = md5_hh(d, a, b, c, x[j + 12], 11, k[45]); c = md5_hh(c, d, a, b, x[j + 15], 16, k[46]); b = md5_hh(b, c, d, a, x[j + 2], 23, k[47]);

    a = md5_ii(a, b, c, d, x[j + 0], 6, k[48]); d = md5_ii(d, a, b, c, x[j + 7], 10, k[49]); c = md5_ii(c, d, a, b, x[j + 14], 15, k[50]); b = md5_ii(b, c, d, a, x[j + 5], 21, k[51]);
    a = md5_ii(a, b, c, d, x[j + 12], 6, k[52]); d = md5_ii(d, a, b, c, x[j + 3], 10, k[53]); c = md5_ii(c, d, a, b, x[j + 10], 15, k[54]); b = md5_ii(b, c, d, a, x[j + 1], 21, k[55]);
    a = md5_ii(a, b, c, d, x[j + 8], 6, k[56]); d = md5_ii(d, a, b, c, x[j + 15], 10, k[57]); c = md5_ii(c, d, a, b, x[j + 6], 15, k[58]); b = md5_ii(b, c, d, a, x[j + 13], 21, k[59]);
    a = md5_ii(a, b, c, d, x[j + 4], 6, k[60]); d = md5_ii(d, a, b, c, x[j + 11], 10, k[61]); c = md5_ii(c, d, a, b, x[j + 2], 15, k[62]); b = md5_ii(b, c, d, a, x[j + 9], 21, k[63]);

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
  }

  const result = [h0, h1, h2, h3];
  return result.map(val => {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      const byte = (val >>> (i * 8)) & 0xff;
      hex += byte.toString(16).padStart(2, '0');
    }
    return hex;
  }).join('');
}

/**
 * Native Web Crypto API wrappers
 */
export async function generateSha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateSha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Elegant Lightweight SQL Formatter
 * Standardizes syntax casing, inserts indents, and structures statements.
 */
export function formatSql(sql: string): string {
  if (!sql.trim()) return '';

  // Clean double spaces and linebreaks
  let formatted = sql
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',\n  ')
    .trim();

  // List of standard SQL keywords to capitalize and format with indent/newlines
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 
    'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
    'OUTER JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'UNION', 'AS', 'IN', 'LIKE'
  ];

  // Capitalize SQL keywords
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, keyword);
  }

  // Format breaks around major operational clauses
  const majorClauses = [
    'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 
    'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'
  ];

  for (const clause of majorClauses) {
    // Avoid double newlines if it's already at the beginning of a line
    const regex = new RegExp(`(\\s*)\\b${clause}\\b(\\s*)`, 'g');
    formatted = formatted.replace(regex, `\n${clause} `);
  }

  // Clean lines and structure indentation
  const lines = formatted.split('\n');
  const finalLines: string[] = [];
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Determine indentation based on clause type
    if (
      line.startsWith('AND') || 
      line.startsWith('OR') || 
      line.startsWith('ON')
    ) {
      finalLines.push('  ' + line);
    } else if (
      line.startsWith('SELECT') ||
      line.startsWith('FROM') ||
      line.startsWith('WHERE') ||
      line.startsWith('ORDER') ||
      line.startsWith('GROUP') ||
      line.startsWith('LIMIT') ||
      line.startsWith('JOIN') ||
      line.startsWith('LEFT') ||
      line.startsWith('RIGHT') ||
      line.startsWith('INNER') ||
      line.startsWith('VALUES') ||
      line.startsWith('SET')
    ) {
      finalLines.push(line);
    } else {
      // Indent generic contents inside select or columns list
      finalLines.push('  ' + line);
    }
  }

  return finalLines.join('\n').trim();
}
