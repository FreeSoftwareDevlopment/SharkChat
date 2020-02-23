const dbFile = "./.data/user-dbase.db";
const fs = require("fs");
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE User (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT,password LONGTEXT, perm INTEGER)"
    );
    console.log("New table's created!");

    // insert default dreams
    db.serialize(() => {
      db.run(
        'INSERT INTO User (username,password,perm) VALUES ("sharkbyteprojects", "26481f32ce5a53173b2b15fa9f010f3c", 1)'

      );
    });
  } else {
    console.log("Database ready to go!");
    db.each("SELECT * from User", (err, row) => {
      if (row) {
        console.log(`record: ${row.username}`);
      }
    });
  }
});
function getid(ids = {}) {
  return new Promise((res, rej) => {
    var elem = [];
    if (ids) {
      for (let key in ids) {
        elem.push(`${key} = ?`);
      }
    }
    db.get(
      "SELECT * FROM User WHERE " + elem.join(" AND "),
      Object.values(ids),
      (err, ress) => {
        if (err) {
          rej(err);
        } else {
          res(ress);
        }
      }
    );
  });
}
function add(valuess, hashmaker) {
  return new Promise((res, rej) => {
    db.run(
      `INSERT INTO User (username,password,perm) VALUES (?,?,?)`,
      valuess.name,
      hashmaker(2, valuess.password),
      0,
      error => {
        if (error) {
          rej({ message: 0 });
        } else {
          res({ message: 1 });
        }
      }
    );
  });
}
function getuser(name, passwd) {
  return new Promise((res, rej) => {
    db.all(
      "SELECT * FROM User WHERE username=? AND password=?",
      name,
      passwd,
      (err, rows) => {
        if (err) {
          rej({ message: 0 });
        } else {
          res(rows);
        }
      }
    );
  });
}
function getalls(callback, res) {
  db.all("SELECT * FROM User", (err, rows) => {
    callback(err, rows, res);
  });
}
function rem(request, response, redurl) {
  db.run(
    `DELETE FROM User WHERE id=? AND perm=?`,
    request.body.rm,
    0,
    error => {
      if (error) {
        response.send({
          message: "error!",
          action: "remove",
          id: request.body.rm,
          error: error
        });
      } else {
        response.redirect(redurl);
      }
    }
  );
}
module.exports = {
  add,
  getuser,
  getid,
  getalls,
  rem
};
