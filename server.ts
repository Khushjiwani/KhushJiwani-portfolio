import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Database Connection (Optional if URL provided)
  const pool = process.env.DATABASE_URL 
    ? new pg.Pool({ connectionString: process.env.DATABASE_URL })
    : null;

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('--- New Contact Form Submission ---');
    console.log(`From: ${name} (${email})`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------');

    // Here you would typically integrate with an email service like SendGrid, Mailtrap, or AWS SES
    // Example: 
    // await sendEmail({ to: 'khushjiwani02@gmail.com', subject: `Portfolio Contact from ${name}`, body: message });

    res.json({ success: true, message: 'Message received successfully' });
  });

  // Database Test Route
  app.get('/api/db-status', async (req, res) => {
    if (!pool) return res.json({ status: 'PostgreSQL URL not configured' });
    try {
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      res.json({ status: 'Connected' });
    } catch (err) {
      res.status(500).json({ status: 'Error', message: err instanceof Error ? err.message : String(err) });
    }
  });

  // Vite Middleware / Static Files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
