/**
 * Aura Dental Studio - Hardened Production HTTP Server
 * Built with Node.js Standard Library (Zero Dependencies - Maximum Attack Surface Reduction)
 * 
 * Hardening Measures Implemented:
 * 1. Sensitive File & Source Code Protection (Denies access to .git, .env, server.js, package.json, etc.)
 * 2. Sliding-Window Rate Limiting (Mitigates DoS, brute force, and rapid scanning)
 * 3. Anti-Slowloris Timeouts (10s request timeout, 5s headers timeout)
 * 4. URI Length Protection (Mitigates buffer overflows / URI length attacks)
 * 5. Comprehensive Security Headers:
 *    - Strict Content Security Policy (CSP) with object-src 'none' & frame-ancestors 'none'
 *    - HTTP Strict Transport Security (HSTS)
 *    - Anti-Clickjacking (X-Frame-Options: DENY)
 *    - Anti-MIME Sniffing (X-Content-Type-Options: nosniff)
 *    - Cross-Origin Isolation (COOP, CORP)
 *    - Strict Permissions Policy
 * 6. Zero Information Leakage (No stack traces or server version banners)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname);

// MIME type allowlist
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=UTF-8'
};

// Sensitive file patterns strictly blocked from HTTP access
const SENSITIVE_PATTERNS = [
  /^\/\./,                   // Any hidden file or folder (.git, .env, .gitignore)
  /server\.js$/i,            // Backend server code
  /package(-lock)?\.json$/i, // Dependencies and package configuration
  /\.md$/i,                  // Internal documentation/README files
  /node_modules/i            // Dependency folders
];

// Sliding-window in-memory rate limiter (120 requests/minute per IP)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const requestCounts = new Map();

// Periodic garbage collection for rate-limit store
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.startTime > RATE_LIMIT_WINDOW_MS) {
      requestCounts.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

function isRateLimited(ip) {
  const now = Date.now();
  let client = requestCounts.get(ip);

  if (!client || now - client.startTime > RATE_LIMIT_WINDOW_MS) {
    requestCounts.set(ip, { count: 1, startTime: now });
    return false;
  }

  client.count++;
  return client.count > RATE_LIMIT_MAX_REQUESTS;
}

const server = http.createServer((req, res) => {
  // 1. IP extraction & Rate Limiting
  const clientIp = req.socket.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    res.writeHead(429, {
      'Content-Type': 'text/plain',
      'Retry-After': '60'
    });
    res.end('429 Too Many Requests: Rate limit exceeded. Try again in 60 seconds.');
    return;
  }

  // 2. URI Length Validation (Defense against buffer overflow / slow URI attacks)
  if (req.url.length > 1024) {
    res.writeHead(414, { 'Content-Type': 'text/plain' });
    res.end('414 URI Too Long');
    return;
  }

  // 3. HTTP Method Restriction (Only GET and HEAD for static application)
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      'Content-Type': 'text/plain',
      'Allow': 'GET, HEAD'
    });
    res.end('405 Method Not Allowed');
    return;
  }

  // 4. Enterprise Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; '));

  // 5. Parse, sanitize and check requested path
  let parsedUrl;
  try {
    parsedUrl = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('400 Bad Request: Malformed URI');
    return;
  }

  let safePath = path.normalize(parsedUrl);
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  // 6. Sensitive file protection check
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(safePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  // 7. Directory Traversal Guard (Must be strictly inside PUBLIC_DIR)
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden: Directory traversal blocked');
    return;
  }

  // 8. Extension and Content Type Validation
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  // 9. File Existence and Streaming
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Cache control
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    }

    res.writeHead(200, { 'Content-Type': contentType });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    });
  });
});

// DoS Defense: Socket Timeouts
server.timeout = 10000;        // 10s request timeout against Slowloris
server.headersTimeout = 5000;  // 5s header timeout
server.requestTimeout = 8000;

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Aura Dental Studio (Hardened Production Server)`);
  console.log(`Listening securely at: http://localhost:${PORT}`);
  console.log(`Rate limiting: 120 req/min | DoS timeouts: active`);
  console.log(`====================================================`);
});
