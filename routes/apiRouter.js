const express = require('express');
const { config } = require('../config');
const { crawlerHtml, crawlerChapter, crawlerContent } = require('../handler/baseCrawler');

const router = express.Router();

async function fetchJsonP(url, options = {}) {
  console.log(options);
  try {
    return await jsonp(url, {param: {id: options.bookId, hash: options.hash}, timeout: 3000}, (err, data) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(data);
      }
    });
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}

router.get('/', (req, res) => {
  res.send(config.endpoint);
})

router.post('/crawler', async (req, res) => {
  const { url,options } = req.body;
  const result = await crawlerHtml(url, options);

  return res.json(result);
})

router.post('/crawler/chapter', async (req, res) => {
  const { url,options } = req.body;
  const result = await crawlerChapter(url, options);

  return res.json(result);
})

router.post('/crawler/content', async (req, res) => {
  const { url,options } = req.body;

  const result = await crawlerContent(url, options);

  return res.json(result);
})

module.exports = router;