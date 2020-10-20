const axios = require('axios').default;

const config = require('../config');

async function fetch(url, options = {}) {
  const requestOption = {
    url,
    followRedirect: false,
    strictSSL: false,
    validateStatus: status => status >= 200 && status <= 404,
    maxRedirects: 0,
    headers: {
      'User-Agent': config.device.mobile.userAgent,
    },
    responseType: 'arraybuffer',
  };

  try {
    const res = await axios(requestOption);

    return res;
  } catch (err) {
    throw new Error(`axios: ${err.message}`);
  }
}

module.exports = fetch;