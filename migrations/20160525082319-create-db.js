const fs = require('fs');
const path = require('path');

exports.up = function(db, callback) {
  const filePath = path.join(__dirname + '/sqls/20160525082319-create-db-up.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (err) return console.log(err);
    db.runSql(data, function(err) {
      if (err) return console.log(err);
      callback();
    });
  });
};

exports.down = function(db, callback) {
  const filePath = path.join(__dirname + '/sqls/20160525082319-create-db-down.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (err) return console.log(err);
    db.runSql(data, function(err) {
      if (err) return console.log(err);
      callback();
    });
  });
};