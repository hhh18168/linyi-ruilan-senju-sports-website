import crypto from 'node:crypto';

const value = process.argv.slice(2).join(' ');

if (!value) {
  console.error('Usage: node scripts/hash-admin-secret.mjs "your secret"');
  process.exit(1);
}

console.log(crypto.createHash('sha256').update(value).digest('hex'));
