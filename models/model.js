const sql = require('./db');

class Model {
  getClassName() {
    const name = this.constructor.name+'s';
    return name.toLocaleLowerCase();
  }

  async create(instance) {
    return new Promise((resolve, reject) => { 
      sql.query(`INSERT INTO ${this.getClassName()} SET ?`, instance, (err, res) => {
        if (err) reject(err);
        
        resolve({ id: res.insertId, ...instance });
      });
    });
  }

  async findByKey (key, value) {
    return new Promise((resolve, reject) => { 
      sql.query(`SELECT * FROM ${this.getClassName()} WHERE ${key} = ${value}`, (err, res) => {
        if (err) reject(err);

        if (res.length) resolve(res);

        resolve({ msg: `${this.getClassName()} not_found` });
      });
    });
  }

  async updateById (id, instance) {
    const keys = Object.keys(instance);
    const msg = keys.reduce((t, v) => t + "= ? "+v) + "= ?";

    return new Promise((resolve, reject) => {
      sql.query(`UPDATE ${this.getClassName()} SET ${msg} WHERE id = ?`, [...Object.values(instance),id], (err, res) => {
        if (err) reject(err);

        if (res.affectedRows === 0 ) resolve({ kind: "not_found" }, null);

        resolve({ id: id, ...instance });
      });
    })
  }
}

module.exports = Model;