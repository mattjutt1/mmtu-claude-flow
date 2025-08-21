const fs = require('fs');
const readline = require('readline');

const a = '[A-Za-z0-9+/]';
const b = '[A-Za-z0-9]';

// Basic patterns for secrets
const patterns = [
  new RegExp(`(?<=[^${b}-_.]|^)${a}{20,}(?=[^${b}-_.]|$)`, 'g'),
  new RegExp('("|\'|"`)?([a-zA-Z0-9_]+_key|key|token|secret|password|pass|auth|jwt|bearer|api_key|api-key|access_token|refresh_token)("|\'|"`)?\s*[:=]\s*("|\'|"`)?[a-zA-Z0-9_\-.~+%/=]+("|\'|"`)?', 'gi'),
  new RegExp('-----BEGIN[ A-Z]+ PRIVATE KEY-----[\s\S]*?-----END[ A-Z]+ PRIVATE KEY-----', 'gi')
];

function getEntropy(str) {
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }

  let entropy = 0;
  for (const char in freq) {
    const p = freq[char] / str.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

function redact(line) {
  let redactedLine = line;
  for (const pattern of patterns) {
    redactedLine = redactedLine.replace(pattern, '[REDACTED]');
  }

  // Entropy-based redaction for long strings
  const words = redactedLine.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length > 40 && getEntropy(word) > 4.5) {
      words[i] = '[REDACTED]';
    }
  }
  return words.join(' ');
}

async function processLogFile(filePath) {
  const tempFilePath = `${filePath}.tmp`;
  const fileStream = fs.createReadStream(filePath);
  const tempStream = fs.createWriteStream(tempFilePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const redactedLine = redact(line);
    if (Buffer.from(redactedLine).length <= 8192) {
      tempStream.write(redactedLine + '\n');
    }
  }

  tempStream.end();

  fs.renameSync(tempFilePath, filePath);
}

if (require.main === module) {
  const logFilePath = process.argv[2];
  if (!logFilePath) {
    console.error('Usage: node redact-log.js <path-to-log-file>');
    process.exit(1);
  }
  processLogFile(logFilePath).catch(err => console.error(err));
}

module.exports = { redact, processLogFile };
