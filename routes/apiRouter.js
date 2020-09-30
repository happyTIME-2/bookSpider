const express = require('express');
const crawler = require('../handler/crawler');
const iconv = require('iconv-lite');
const config = require('../config');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(config.endpoint);
})

router.post('/crawler', async (req, res) => {
  const { url,options } = req.body;
  try {
    const result = await crawler(url, options);

    let charset = 'utf8';

    let html = iconv.decode(result.data, charset);

    const regCharset = /<meta[^>]+charset=['"]?([a-z0-9-]+)['"]?/i;
    const charsetMatch = html.match(regCharset);

    charset = charsetMatch[1].toLowerCase() === 'utf-8' ? 'utf8' : charsetMatch[1].toLowerCase();

    if (charset !=='utf8') {
      html = iconv.decode(result.data,charset);
    }

    const data = {
      html,
      status: result.status,
    }

    return res.json(data);
  } catch (e) {
    throw new Error(`crawler api: ${e.message}`)
  }
})

module.exports = router;