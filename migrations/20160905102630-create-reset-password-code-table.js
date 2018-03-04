'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable("reset_codes", {
    id: { type: 'bigint', primaryKey: true, autoIncrement: true },
    userId: {
      type: 'bigint',
      notNull: true,
      foreignKey: {
        name: 'reset_codes_users_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
    }},
    resetCode: { type: 'string', length: 100, notNull: true },
    resetCodeExpires: 'datetime'

  }, callback);
};

exports.down = function(db, callback) {
  db.removeForeignKey('reset_codes', 'reset_codes_users_id_fk', function (){
    db.dropTable('reset_codes', callback);
  });
};
