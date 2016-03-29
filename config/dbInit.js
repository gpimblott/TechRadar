var dbp = require('./dbConfig.js');
var pg = require('pg');
var pgp = require('pg-promise')({
    // Initialization Options
});

var cn = 'postgres://' + dbp.pg.username +':' + dbp.pg.password + '@' + dbp.pg.host + ':' + dbp.pg.port + '/' + dbp.pg.dbname;

console.log(cn);

cn += "?ssl=true";

var db = pgp(cn);


db.tx(function () {
        // Clean up - may not always be needed
        var t01 = this.none('DROP TABLE history;')
        var t02 = this.none('DROP TABLE entries');
        var t03 = this.none('DROP TABLE status');
        var t04 = this.none('DROP TABLE categories');

        // Create tables
        var t1 = this.none('CREATE TABLE IF NOT EXISTS categories(id SERIAL PRIMARY KEY, name VARCHAR(40) not null )');
        var t2 = this.none('CREATE TABLE IF NOT EXISTS status(id SERIAL PRIMARY KEY, name VARCHAR(10)  )');
        var t3 = this.none('CREATE TABLE IF NOT EXISTS entries(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, text TEXT , '+
            'category integer references categories(id) , status integer references status(id))');
        var t4 = this.none('CREATE TABLE IF NOT EXISTS history(id SERIAL PRIMARY KEY, entry integer references entries(id) )');

        // Insert test data
        var t5 = this.none("INSERT INTO status (name) VALUES ('Adopt'),('Assess'),('Hold'), ('Trial') ");
        var t6 = this.none("INSERT INTO categories (name) VALUES ('Tools'),('Languages and Frameworks'),('Platforms'),('Infrastructure') ");
        var t7 = this.none("INSERT INTO entries (category, status, name , text ) VALUES ");


        //{ name: 'Docker', pc: { r: 170, t: 19 }, movement: 't' },
//  { name: 'bind',    pc: { r: 150, t: 69 },    movement: 'c' },
//  { name: 'Appium',    pc: { r: 110, t: 70 },    movement: 'c',    domain: 'mobile, front-end' },
// { name: 'Android Studio',    pc: { r: 180, t: 66 },    movement: 'c',    domain: 'mobile, dev' },
//  { name: 'Responsive Android',    pc: { r: 150, t: 14 },    movement: 'c' },
//  { name: 'AutoLayout - iOS',    pc: { r: 180, t: 55 },    movement: 'c',    domain: '' },
//  { name: 'Kiwi - iOS unit test',    pc: { r: 120, t: 14 },    movement: 'c',    domain: '' },
//  { name: 'BEM',    pc: { r: 160, t: 60 },    movement: 'c',    domain: 'front-end' },
//  { name: 'Crashlytics',    pc: { r: 180, t: 5 },    movement: 'c',    domain: 'mobile' },
//  { name: 'Consul',    pc: { r: 170, t: 29 },    movement: 't' },
//   { name: 'Swagger Code-Gen',    pc: { r: 180, t: 82 },    movement: 'c' },
//   { name: 'PowerMock ^',    pc: { r: 180, t: 46 },    movement: 'c' },
//   { name: 'Mockito',    pc: { r: 170, t: 84 },    movement: 'c',    domain: 'back-end' },
//   { name: 'Json Web Tokens (JWT)',    pc: { r: 180, t: 77 },    movement: 'c' },
//   { name: 'Lemming',    pc: { r: 160, t: 82 },    movement: 'c' },
//   { name: 'Hystrix',    pc: { r: 150, t: 36 },    movement: 'c' },
//  { name: 'Git',    pc: { r: 130, t: 73 },    movement: 'c' },
//
//  { name: 'Ansible',    pc: { r: 280, t: 74 },    movement: 'c' },
//  { name: 'Hip Chat',    pc: { r: 280, t: 78 },    movement: 'c' },
//  { name: 'Trello',    pc: { r: 260, t: 75 },    movement: 'c' },
//  { name: 'Charles HTTP Proxy',    pc: { r: 260, t: 48 },    movement: 'c' },
//  { name: 'Xamarin', pc: { r: 280, t: 51 }, movement: 'c' },
//  { name: 'Android Annotations',    pc: { r: 280, t: 25 },    movement: 'c' },
//  { name: 'GenyMotion',    pc: { r: 210, t: 31 },    movement: 'c' },
//
//  { name: 'JDBI ^',    pc: { r: 80, t: 56 },    movement: 'c' },
//  { name: 'Kafka',    pc: { r: 12, t: 25 },    movement: 'c',    domain: 'back-end' },
//  { name: 'ELK',    pc: { r: 30, t: 72 },    movement: 'c',    domain: 'back-end' },
//  { name: 'Liquibase',    pc: { r: 80, t: 76 },    movement: 'c' },
//  { name: 'haproxy',    pc: { r: 80, t: 46 },    movement: 'c' },
//
//  { name: 'AppManager ^',    pc: { r: 360, t: 82 },    movement: 'c' },
//  { name: 'Hibernate ^',    pc: { r: 380, t: 56 },    movement: 'c' },
//  { name: 'mongoDB',    pc: { r: 330, t: 5 },    movement: 'c' },
//  { name: 'Subversion',    pc: { r: 330, t: 18 },    movement: 'c' }

        return this.batch([t01,t02,t02,t03,t04, t1,t2,t3,t4,t5,t6 ]);
    })
    .then(function (data) {
        console.log("done:" + data);
    })
    .catch(function (error) {
        console.log(error); // print error;
    });