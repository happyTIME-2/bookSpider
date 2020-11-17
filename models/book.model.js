const sql = require('./db');

const Book = function(book) {
  this.bookId = book.bookId;
  this.url = book.url;
}

Book.create = async (newBook) => {
  return new Promise((resolve, reject) => { 
    sql.query("INSERT INTO books SET ?", newBook, (err, res) => {
      if (err) reject(err);
      
      resolve({ id: res.insertId, ...newBook });
    });
  });
}

Book.findByKey = (key, value) => {
  return new Promise((resolve, reject) => { 
    sql.query(`SELECT * FROM books WHERE ${key} = ${value}`, (err, res) => {
      if (err) reject(err);

      if (res.length) resolve(res);

      resolve({ msg: "book not_found" });
    });
  });
} 

module.exports = Book;