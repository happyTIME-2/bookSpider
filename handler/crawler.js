const fetch = require('./fetch');
const iconv = require('iconv-lite');

async function crawler(url, options = {}) {
  try {
    const res = await fetch(url, options);

    let charset = 'utf8';

    let html = iconv.decode(res.data, charset);

    const regCharset = /<meta[^>]+charset=['"]?([a-z0-9-]+)['"]?/i;
    const charsetMatch = html.match(regCharset);

    charset = charsetMatch[1].toLowerCase() === 'utf-8' ? 'utf8' : charsetMatch[1].toLowerCase();

    if (charset !=='utf8') {
      html = iconv.decode(res.data,charset);
    }

    return { html, status: res.status };
  } catch (e) {
    throw new Error(`crawler: ${e.message}`);
  }
}

module.exports = crawler;