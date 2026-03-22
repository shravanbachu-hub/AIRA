// import 'dotenv/config';
// import express from 'express';
// import cors from 'cors';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';
// import { mkdirSync, existsSync } from 'fs';
// import db from './db.js';
// import { initMailer, sendNewRegistrationEmail, sendApprovalEmail, sendRejectionEmail, sendPasswordResetEmail, sendChallengeEmail } from './email.js';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const app = express();
// const PORT = process.env.PORT || 4000;
// const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production';
// const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'shravanbachu@gmail.com';

// // Ensure data directory exists
// const dataDir = join(__dirname, '..', 'data');
// if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ── Seed admin user on first run ──
// (async () => {
//   const admin = db.prepare('SELECT * FROM users WHERE email = ?').get(ADMIN_EMAIL);
//   if (!admin) {
//     const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Aira@2026', 10);
//     db.prepare('INSERT INTO users (email, name, phone, password, status) VALUES (?, ?, ?, ?, ?)').run(
//       ADMIN_EMAIL, 'Admin', '', hash, 'approved'
//     );
//     console.log('✓ Admin user created');
//   }
// })();

// // ── JWT helper ──
// function generateToken(email) {
//   return jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
// }

// function authMiddleware(req, res, next) {
//   const header = req.headers.authorization;
//   if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
//   try {
//     const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
//     req.userEmail = decoded.email;
//     next();
//   } catch {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// }

// function adminOnly(req, res, next) {
//   if (req.userEmail !== ADMIN_EMAIL) return res.status(403).json({ error: 'Admin only' });
//   next();
// }

// // ══════════════════════════════════════
// // AUTH ROUTES
// // ══════════════════════════════════════

// // POST /api/login
// app.post('/api/login', (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

//   const normalEmail = email.toLowerCase().trim();
//   const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalEmail);

//   if (!user) {
//     // Check if pending
//     const pending = db.prepare('SELECT * FROM users WHERE email = ? AND status = ?').get(normalEmail, 'pending');
//     if (pending) return res.status(403).json({ error: 'PENDING' });
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }

//   if (user.status !== 'approved') {
//     return res.status(403).json({ error: 'PENDING' });
//   }

//   if (!bcrypt.compareSync(password, user.password)) {
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }

//   const token = generateToken(normalEmail);
//   res.json({
//     token,
//     user: { email: user.email, name: user.name, isAdmin: normalEmail === ADMIN_EMAIL },
//   });
// });

// // POST /api/register
// app.post('/api/register', async (req, res) => {
//   const { name, email, phone, password } = req.body;
//   if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password required' });
//   if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

//   const normalEmail = email.toLowerCase().trim();
//   const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(normalEmail);
//   if (existing) {
//     if (existing.status === 'pending') return res.status(409).json({ error: 'ALREADY_PENDING' });
//     return res.status(409).json({ error: 'ALREADY_EXISTS' });
//   }

//   const hash = bcrypt.hashSync(password, 10);
//   db.prepare('INSERT INTO users (email, name, phone, password, status) VALUES (?, ?, ?, ?, ?)').run(
//     normalEmail, name.trim(), phone?.trim() || '', hash, 'pending'
//   );

//   // Email admin
//   await sendNewRegistrationEmail({ name: name.trim(), email: normalEmail, phone: phone?.trim() });

//   res.json({ message: 'Registration submitted. Awaiting admin approval.' });
// });

// // POST /api/forgot-password
// app.post('/api/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ error: 'Email required' });

//   const normalEmail = email.toLowerCase().trim();
//   const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalEmail);
//   if (!user) return res.status(404).json({ error: 'No account found with this email' });

//   // Generate temp password
//   const tempPw = 'Reset' + Math.random().toString(36).slice(2, 8).toUpperCase() + '!';
//   const hash = bcrypt.hashSync(tempPw, 10);
//   db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hash, normalEmail);

//   await sendPasswordResetEmail(normalEmail, tempPw);
//   res.json({ message: 'New password sent to your email' });
// });

// // GET /api/me — get current user info
// app.get('/api/me', authMiddleware, (req, res) => {
//   const user = db.prepare('SELECT email, name, status FROM users WHERE email = ?').get(req.userEmail);
//   if (!user) return res.status(404).json({ error: 'User not found' });
//   res.json({ ...user, isAdmin: req.userEmail === ADMIN_EMAIL });
// });

// // ══════════════════════════════════════
// // ADMIN ROUTES
// // ══════════════════════════════════════

// // GET /api/admin/pending
// app.get('/api/admin/pending', authMiddleware, adminOnly, (req, res) => {
//   const users = db.prepare('SELECT email, name, phone, created_at FROM users WHERE status = ?').all('pending');
//   res.json(users);
// });

// // GET /api/admin/approved
// app.get('/api/admin/approved', authMiddleware, adminOnly, (req, res) => {
//   const users = db.prepare('SELECT email, name, phone, created_at, approved_at FROM users WHERE status = ? AND email != ?').all('approved', ADMIN_EMAIL);
//   res.json(users);
// });

// // POST /api/admin/approve
// app.post('/api/admin/approve', authMiddleware, adminOnly, async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ error: 'Email required' });

//   const user = db.prepare('SELECT * FROM users WHERE email = ? AND status = ?').get(email, 'pending');
//   if (!user) return res.status(404).json({ error: 'Pending user not found' });

//   db.prepare("UPDATE users SET status = 'approved', approved_at = datetime('now') WHERE email = ?").run(email);
//   await sendApprovalEmail({ name: user.name, email });
//   res.json({ message: `${email} approved` });
// });

// // POST /api/admin/reject
// app.post('/api/admin/reject', authMiddleware, adminOnly, async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ error: 'Email required' });

//   const user = db.prepare('SELECT * FROM users WHERE email = ? AND status = ?').get(email, 'pending');
//   if (!user) return res.status(404).json({ error: 'Pending user not found' });

//   db.prepare('DELETE FROM users WHERE email = ?').run(email);
//   await sendRejectionEmail({ name: user.name, email });
//   res.json({ message: `${email} rejected` });
// });

// // POST /api/admin/remove
// app.post('/api/admin/remove', authMiddleware, adminOnly, (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ error: 'Email required' });
//   if (email === ADMIN_EMAIL) return res.status(400).json({ error: 'Cannot remove admin' });

//   db.prepare('DELETE FROM users WHERE email = ?').run(email);
//   res.json({ message: `${email} removed` });
// });

// // ══════════════════════════════════════
// // SERVE FRONTEND (production build)
// // ══════════════════════════════════════
// const distPath = join(__dirname, '..', 'dist');
// app.use(express.static(distPath));
// app.get('*', (req, res) => {
//   res.sendFile(join(distPath, 'index.html'));
// });

// // ── Start ──
// initMailer();
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`\n🚀 AiraPropFirm running on port ${PORT}`);
//   console.log(`   Admin: ${ADMIN_EMAIL}`);
//   console.log(`   URL: ${process.env.SITE_URL || `http://localhost:${PORT}`}\n`);
// });

// // POST /api/challenge
// app.post('/api/challenge', async (req, res) => {
//   const { firstName, lastName, email, address, experience, platform, paymentMethod } = req.body;
//   if (!firstName || !lastName || !email || !address || !experience || !platform || !paymentMethod) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }
//   await sendChallengeEmail({ firstName, lastName, email, address, experience, platform, paymentMethod });
//   res.json({ message: 'Challenge application submitted successfully' });
// });




import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initDB, query, getOne, run } from './db.js';
import { initMailer, sendNewRegistrationEmail, sendApprovalEmail, sendRejectionEmail, sendPasswordResetEmail, sendChallengeEmail } from './email.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_production';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@airapropfirm.com';

// Middleware
app.use(cors());
app.use(express.json());

// ── JWT helper ──
function generateToken(email) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    req.userEmail = decoded.email;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.userEmail !== ADMIN_EMAIL) return res.status(403).json({ error: 'Admin only' });
  next();
}

// ══════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const normalEmail = email.toLowerCase().trim();
  const user = await getOne('SELECT * FROM users WHERE email = $1', [normalEmail]);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.status === 'pending') {
    return res.status(403).json({ error: 'PENDING' });
  }

  if (user.status !== 'approved') {
    return res.status(403).json({ error: 'PENDING' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(normalEmail);
  res.json({
    token,
    user: { email: user.email, name: user.name, isAdmin: normalEmail === ADMIN_EMAIL },
  });
});

// POST /api/register
app.post('/api/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const normalEmail = email.toLowerCase().trim();
  const existing = await getOne('SELECT * FROM users WHERE email = $1', [normalEmail]);
  if (existing) {
    if (existing.status === 'pending') return res.status(409).json({ error: 'ALREADY_PENDING' });
    return res.status(409).json({ error: 'ALREADY_EXISTS' });
  }

  const hash = bcrypt.hashSync(password, 10);
  await run(
    'INSERT INTO users (email, name, phone, password, status) VALUES ($1, $2, $3, $4, $5)',
    [normalEmail, name.trim(), phone?.trim() || '', hash, 'pending']
  );

  await sendNewRegistrationEmail({ name: name.trim(), email: normalEmail, phone: phone?.trim() });

  res.json({ message: 'Registration submitted. Awaiting admin approval.' });
});

// POST /api/forgot-password
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const normalEmail = email.toLowerCase().trim();
  const user = await getOne('SELECT * FROM users WHERE email = $1', [normalEmail]);
  if (!user) return res.status(404).json({ error: 'No account found with this email' });

  const tempPw = 'Reset' + Math.random().toString(36).slice(2, 8).toUpperCase() + '!';
  const hash = bcrypt.hashSync(tempPw, 10);
  await run('UPDATE users SET password = $1 WHERE email = $2', [hash, normalEmail]);

  await sendPasswordResetEmail(normalEmail, tempPw);
  res.json({ message: 'New password sent to your email' });
});

// GET /api/me
app.get('/api/me', authMiddleware, async (req, res) => {
  const user = await getOne('SELECT email, name, status FROM users WHERE email = $1', [req.userEmail]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ ...user, isAdmin: req.userEmail === ADMIN_EMAIL });
});

// ══════════════════════════════════════
// CHALLENGE ROUTES
// ══════════════════════════════════════

// POST /api/challenge
app.post('/api/challenge', async (req, res) => {
  const { firstName, lastName, email, address, experience, platform, paymentMethod } = req.body;
  if (!firstName || !lastName || !email || !address || !experience || !platform || !paymentMethod) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  await run(
    'INSERT INTO challenges (first_name, last_name, email, address, experience, platform, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [firstName.trim(), lastName.trim(), email.toLowerCase().trim(), address.trim(), experience, platform, paymentMethod]
  );

  await sendChallengeEmail({ firstName, lastName, email, address, experience, platform, paymentMethod });
  res.json({ message: 'Challenge application submitted successfully' });
});

// ══════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════

// GET /api/admin/pending
app.get('/api/admin/pending', authMiddleware, adminOnly, async (req, res) => {
  const users = await query('SELECT email, name, phone, created_at FROM users WHERE status = $1 ORDER BY created_at DESC', ['pending']);
  res.json(users);
});

// GET /api/admin/approved
app.get('/api/admin/approved', authMiddleware, adminOnly, async (req, res) => {
  const users = await query('SELECT email, name, phone, created_at, approved_at FROM users WHERE status = $1 AND email != $2 ORDER BY approved_at DESC', ['approved', ADMIN_EMAIL]);
  res.json(users);
});

// GET /api/admin/challenges
app.get('/api/admin/challenges', authMiddleware, adminOnly, async (req, res) => {
  const challenges = await query('SELECT * FROM challenges ORDER BY created_at DESC');
  res.json(challenges);
});

// POST /api/admin/approve
app.post('/api/admin/approve', authMiddleware, adminOnly, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const user = await getOne('SELECT * FROM users WHERE email = $1 AND status = $2', [email, 'pending']);
  if (!user) return res.status(404).json({ error: 'Pending user not found' });

  await run("UPDATE users SET status = 'approved', approved_at = NOW() WHERE email = $1", [email]);
  await sendApprovalEmail({ name: user.name, email });
  res.json({ message: `${email} approved` });
});

// POST /api/admin/reject
app.post('/api/admin/reject', authMiddleware, adminOnly, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const user = await getOne('SELECT * FROM users WHERE email = $1 AND status = $2', [email, 'pending']);
  if (!user) return res.status(404).json({ error: 'Pending user not found' });

  await run('DELETE FROM users WHERE email = $1', [email]);
  await sendRejectionEmail({ name: user.name, email });
  res.json({ message: `${email} rejected` });
});

// POST /api/admin/remove
app.post('/api/admin/remove', authMiddleware, adminOnly, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  if (email === ADMIN_EMAIL) return res.status(400).json({ error: 'Cannot remove admin' });

  await run('DELETE FROM users WHERE email = $1', [email]);
  res.json({ message: `${email} removed` });
});

// POST /api/admin/challenge/approve
app.post('/api/admin/challenge/approve', authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Challenge ID required' });

  await run("UPDATE challenges SET status = 'approved', reviewed_at = NOW() WHERE id = $1", [id]);
  res.json({ message: 'Challenge approved' });
});

// POST /api/admin/challenge/reject
app.post('/api/admin/challenge/reject', authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Challenge ID required' });

  await run("UPDATE challenges SET status = 'rejected', reviewed_at = NOW() WHERE id = $1", [id]);
  res.json({ message: 'Challenge rejected' });
});

// ══════════════════════════════════════
// SERVE FRONTEND (production build)
// ══════════════════════════════════════
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

// ── Start ──
async function start() {
  await initDB();
  initMailer();

  // Seed admin user
  const admin = await getOne('SELECT * FROM users WHERE email = $1', [ADMIN_EMAIL]);
  if (!admin) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Aira@2026', 10);
    await run(
      'INSERT INTO users (email, name, phone, password, status) VALUES ($1, $2, $3, $4, $5)',
      [ADMIN_EMAIL, 'Admin', '', hash, 'approved']
    );
    console.log('✓ Admin user created');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 AiraPropFirm running on port ${PORT}`);
    console.log(`   Admin: ${ADMIN_EMAIL}`);
    console.log(`   URL: ${process.env.SITE_URL || `http://localhost:${PORT}`}\n`);
  });
}

start().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
