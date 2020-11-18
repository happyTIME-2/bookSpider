const Model = require('./model');

class Chapter extends Model 
{
  constructor (chapter) {
    this.title = chapter.title;
    this.link = chapter.link;
  }
}

module.exports = Chapter;