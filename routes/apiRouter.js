const express = require('express');
const crawler = require('../handler/crawler');
const config = require('../config');
const cheerio = require('cheerio');
const jsonp = require('jsonp');

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
  try {
    const result = await crawler(url, options);

    return res.json(result);
  } catch (e) {
    throw new Error(`crawler api: ${e.message}`)
  }
})

router.post('/crawler/chapter', async (req, res) => {
  const { url,options } = req.body;
  // const { bookId } = options;
  try {
    const result = await crawler(url, options);

    const $ = cheerio.load(result.html);

    const idPattarn = /(var bookid \= \')(\d+)(\')/;
    const hashPattarn = /(hash \= \')([a-fA-F\d]{16})(\')/;

    const bookId = result.html.match(idPattarn)[2];
    const hash = result.html.match(hashPattarn)[2];

    result.bookId = bookId;
    result.hash = hash;

   // const chapters = await fetch(`https://www.xyxs8.com/home/index/updatecache?id=${bookId}&hash=${hash}`);
   const apiUrl = `https://www.xyxs8.com/home/index/updatecache?id=${bookId}&hash=${hash}`;
   const chapters = await fetchJsonP('https://www.xyxs8.com/home/index/updatecache', {bookId, hash});

   result.chapters = chapters;

    return res.json(result);

    //return chapters;
  } catch (e) {
    throw new Error(`crawler api: ${e.message}`)
  }
})

module.exports = router;