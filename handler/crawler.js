const fetch = require('./fetch');

async function crawler(url, options = {}) {
  try {
    const res = await fetch(url, options);
    console.log(res.data);
    return res;
  } catch (e) {
    throw new Error(`crawler: ${e.message}`);
  }
}

module.exports = crawler;