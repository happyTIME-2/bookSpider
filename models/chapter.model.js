const Model = require('./model');

class Chapter extends Model 
{
  constructor (chapter) {
    super();
    this.bookId = chapter.bookId;
    this.title = chapter.title;
    this.link = chapter.link;
  }
}

module.exports = Chapter;