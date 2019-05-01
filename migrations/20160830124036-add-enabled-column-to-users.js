'use strict';

let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.addColumn('users', 'enabled', {
    type: type.BOOLEAN,
    defaultValue: true //sets enabled=true in all pre-existing records 
  }, function(){
      db.changeColumn('users', 'enabled', {
        defaultValue: false // all newly created records will default to enabled=false
      });
  });
  return null;
};

exports.down = function(db, callback) {
  db.removeColumn('users', 'enabled', callback);
  return null;
};
