const crawler = require('./crawler');
const cheerio = require('cheerio');
const Book = require('../models/book.model');
const Content = require('../models/content.model');
const Chapter = require('../models/chapter.model');

async function search(url, options) {
  try {
    const result = await crawler(url, options);

    const $ = cheerio.load(result.html);

    let search = [];
    const pattarn = /(\_)(\d+)(\/)/;

    $('table tr').each((i, el) => {
      const td = $(el).find('td');
      const name = $(td[0]).children('a').text();
      const url = $(td[0]).children('a').attr('href');
      const author = $(td[2]).text();
      
      if(name === "") {
        return;
      }

      const bookId = url.match(pattarn)[2];

      search.push({ name, url, author, bookId});
    })

    result.list = search;

    delete result.html;

    return result;
  } catch (e) {
    throw new Error(`crawler api: ${e.message}`)
  }
}

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

    chapters.forEach(async (e, i) => {
      const chapter = new Chapter({
        bookId,
        title: Object.keys(e)[0],
        link: Object.values(e)[0],
      });

      const cp = await chapter.findByKey('id', i+1);

      if(cp.msg && cp.msg === 'chapters not_found') {
        try {
          const res = await chapter.create(chapter);
          console.log('create res:', res);
        } catch (e) {
          throw new Error(e);
        }
      } else {
        console.log(`already has ${cp.length} books exists!`);
      }
    });

    const newBook = new Book({
      bookId,
      url,
    });
    
    let kk = await newBook.findByKey('bookId', bookId);
    
    if (kk.msg && kk.msg === 'books not_found') {
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

    const bookIdPattarn = /(var novelId \= \'|\")(\d+)(\'|\")/;
    const chapterIdPattarn = /(var chapterId \= [\'|\"])(\d+)(\'|\")/;

    const bookId = result.html.match(bookIdPattarn).length ? result.html.match(bookIdPattarn)[2] : null;
    const chapterId = result.html.match(chapterIdPattarn).length ? result.html.match(chapterIdPattarn)[2] : null;

    const content = $('#content').text().trim();

    const con = new Content({
      bookId,
      chapterId,
      content
    });

    let kk = await con.findByKey('chapterId', chapterId);

    if (kk.msg && kk.msg === 'contents not_found') {
      try {
        const res = await con.create(con);
        console.log('create res:', res);
      } catch (e) {
        throw new Error(e);
      }
    } else {
      console.log(`already has ${kk.length} contents exists!`);
    }


    result.content = content;

    delete result.html;

    return result;
  } catch (e) {
    throw new Error(`content api: ${e.message}`)
  }
}

module.exports = {
  search,
  crawlerHtml,
  crawlerChapter,
  crawlerContent
}