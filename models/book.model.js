const sql = require('./db');
const Model = require('./model');

class Book extends Model {
  constructor(book) {
    super();
    this.bookId = book.bookId;
    this.url = book.url;
  }
}

module.exports = Book;