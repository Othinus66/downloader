import express from 'express';
import { ytmp3, ytmp4, ttdl, igdl, ytsearch, fbdl } from 'ruhend-scraper';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combined')); // Logging HTTP requests

app.post('/', async (req, res) => {
  const { url, type } = req.body;

  if (!url) {
    console.warn('Missing URL in request');
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    let data;

    switch (type) {
      case 'ytmp3':
        data = await ytmp3(url);
        break;
      case 'ytmp4':
        data = await ytmp4(url);
        break;
      case 'ttdl':
        data = await ttdl(url);
        break;
      case 'igdl':
        data = await igdl(url);
        break;
      case 'ytsearch':
        data = await ytsearch(url);
        break;
      case 'fbdl':
        data = await fbdl(url);
        break;
      default:
        console.warn(`Invalid type received: ${type}`);
        return res.status(400).json({ error: 'Invalid type specified' });
    }

    if (!data) {
      throw new Error(`No data returned for type "${type}" and url "${url}"`);
    }

    res.json(data);
  } catch (error) {
    console.error(`Error processing ${type} for URL ${url}:`, error.stack || error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
