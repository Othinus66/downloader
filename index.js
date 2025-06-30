const express = require('express');
const youtubedl = require('youtube-dl-exec');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

/**
 * Map user-defined quality to youtube-dl format selector
 */

function mapQualityToFormat(quality) {
  switch (quality) {
    case 'audio':
      return 'bestaudio';
    case '360p':
      return 'bestvideo[height<=360]+bestaudio/best[height<=360]';
    case '480p':
      return 'bestvideo[height<=480]+bestaudio/best[height<=480]';
    case '720p':
      return 'bestvideo[height<=720]+bestaudio/best[height<=720]';
    case '1080p':
      return 'bestvideo[height<=1080]+bestaudio/best[height<=1080]';
    default:
      return 'best'; 
  }
}

app.post('/download', async (req, res) => {
  const { url, format, quality, outputPath } = req.body;

  console.log('Received request:', req.body);

  if (!url || !format || !quality || !outputPath) {
    return res.status(400).json({ error: 'Missing url, format, quality, or outputPath' });
  }

  const filename = `video-${Date.now()}.${format}`;
  const fullOutputPath = path.join(outputPath, filename);

  const formatSelector = mapQualityToFormat(quality);

  try {
    const result = await youtubedl(url, {
      output: fullOutputPath,
      format: formatSelector,
      mergeOutputFormat: format, 
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0',
      ],
    });

    return res.status(200).json({
      message: 'Download started',
      path: fullOutputPath,
      result,
    });
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ error: 'Failed to download video' });
  }
});

app.listen(port, () => {
  console.log(`YouTube downloader API listening at http://localhost:${port}`);
});
