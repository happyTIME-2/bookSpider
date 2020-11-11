const express = require('express');
const crawler = require('../handler/crawler');
const config = require('../config');
const cheerio = require('cheerio');

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

    const idPattarn = /(var bookid \= \'|\")(\d+)(\'|\")/;
    const titlePattarn = /(var booktitle \= \'|\")([\u4e00-\u9fa5]+)(\'|\")/;
    const novelIdPattarn = /(var novelId \= \'|\")(\d+)(\'|\")/;
   // const hashPattarn = /(hash \= \'|\")([a-fA-F\d]{16})(\'|\")/;

    const bookId = result.html.match(idPattarn).length ? result.html.match(idPattarn)[2] : null;
    const bookTitle = result.html.match(titlePattarn).length ? result.html.match(titlePattarn)[2] : null;
    const novelId = result.html.match(novelIdPattarn).length ? result.html.match(novelIdPattarn)[2] : null;
   // const hash = result.html.match(hashPattarn).length ? result.html.match(hashPattarn)[2] : null;

    result.args = { bookId, bookTitle, novelId };

    let chapters = [];
    let newList = [];
    let index = 0;

    index = $($('#list dl dt')[1]).index();

    $('#list dl dd a').each((i, el) => {
      let con = $(el).text();
      let href = $(el).attr('href') || '';

      if (i < index - 1) {
        newList.push({
          [con] : href
        })
      } else {
        chapters.push({
          [con] : href
        })
      }
    });

    result.newList = newList;
    result.chapters = chapters;

    delete result.html;

    return res.json(result);
  } catch (e) {
    throw new Error(`chapter api: ${e.message}`)
  }
})

router.post('/crawler/content', async (req, res) => {
  const { url,options } = req.body;

  try {
    const result = await crawler(url, options);
    const $ = cheerio.load(result.html);

    const content = $('#content').text().trim();

    result.content = content;

    delete result.html;

    return res.json(result);
  } catch (e) {
    throw new Error(`content api: ${e.message}`)
  }
})

module.exports = router;