import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { extractor } from './noteExtractor.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_DIST));

app.post('/extract', async (req, res) => {
  const { url = '' } = req.body;
  const result = await extractor(url);
  res.json({ result });
});

app.get('/image-proxy', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).json({ error: "Parametro 'url' ausente." });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(buffer));
  } catch {
    res.status(502).json({ error: 'Falha ao buscar imagem.' });
  }
});

app.get(['/', '/test'], (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
