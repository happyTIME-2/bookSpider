const { defaultConfiguration } = require("./app");

const config = {};

config.endpoint = 'https://www.xyxs8.com/';

config.device = {
  mobile: {
    name: 'mobile device',
    userAgent: 'Mozilla/5.0 (Linux; Android 10) (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/4.0 Chrome/81.0.3904.62 Mobile Safari/537.36'
  },
  pc: {
    name: 'pc device',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36'
  }
}

module.exports = config;