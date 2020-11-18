const crawler = require('./crawler');
const cheerio = require('cheerio');
const Book = require('../models/book.model');
const { use } = require('../routes/apiRouter');

async function crawlerHtml(url, options) {
  try {
    const result = await crawler(url, options);

    return result;
  } catch (e) {
    throw new Error(`crawler api: ${e.message}`)
  }
}

async function crawlerChapter(url, options) {
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

    const newBook = new Book({
      bookId,
      url,
    });
    
    let kk = await newBook.findByKey('bookId', bookId);

    if (kk.msg && kk.msg === 'book not_found') {
      try {
        const res = await newBook.create(newBook);
        console.log('create res:', res);
      } catch (e) {
        throw new Error(e);
      }
    } else {
      console.log(`already has ${kk.length} books exists!`);
    }

    delete result.html;

    return result;
  } catch (e) {
    throw new Error(`chapter api: ${e.message}`)
  }
}

async function crawlerContent(url, options) {
  try {
    const result = await crawler(url, options);
    const $ = cheerio.load(result.html);

    const content = $('#content').text().trim();

    result.content = content;

    delete result.html;

    return result;
  } catch (e) {
    throw new Error(`content api: ${e.message}`)
  }
}

module.exports = {
  crawlerHtml,
  crawlerChapter,
  crawlerContent
}