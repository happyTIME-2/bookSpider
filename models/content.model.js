const Model = require('./model');

class Content extends Model{
  constructor(content) {
    super();
    this.bookId = content.bookId;
    this.chapterId = content.chapterId;
    this.content = content.content;
  }
}

module.exports = Content;