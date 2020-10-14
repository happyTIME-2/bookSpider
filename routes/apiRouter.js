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

    return res.json(result);
  } catch (e) {
    throw new Error(`crawler api: ${e.message}`)
  }
})

router.post('/crawler/chapter', async (req, res) => {
  const { url,options } = req.body;
  const { bookId } = options;
  try {
    const result = await crawler(url, options);

    console.log(bookId);

    return res.json(result);
  } catch (e) {
    throw new Error(`crawler api: ${e.message}`)
  }
})

module.exports = router;