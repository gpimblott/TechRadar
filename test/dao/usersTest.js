var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var dbhelper = require('../../utils/dbhelper.js');
var usersDao = require('../../dao/users');
var User = require('../../models/user');

describe("dao/users", function() {
        var dbhelperQuerySpy;
        var dbhelperInsertSpy;

        beforeEach(function(){
            dbhelperQuerySpy = sinon.stub(dbhelper, 'query'); 
            dbhelperInsertSpy = sinon.stub(dbhelper, 'insert'); 
        });

        afterEach(function(){
            dbhelper.query.restore();
            dbhelper.insert.restore();
        });

    describe("findById", function() {
        it("should create a query that selects user by id", function() {
            usersDao.findById(1, null);
            var sqlQuery = dbhelperQuerySpy.getCalls()[0].args[0];

            expect(sqlQuery).is.a('string').to.contain("SELECT");
            expect(sqlQuery).is.a('string').to.contain("FROM users");
            expect(sqlQuery).to.match(/WHERE.*id=\$1/i);
        });

        it("should pass user's ID to the SQL query", function() {
            var userId = 34523453452;

            usersDao.findById(userId, null);
            var userIdQueryParam = dbhelperQuerySpy.getCalls()[0].args[1][0];

            expect(userIdQueryParam).is.a('number').equal(userId);
        });
    });

    describe("findByEmail", function() {

        it("should create a query that selects user by email", function() {
            usersDao.findByEmail(1, null);
            var sqlQuery = dbhelperQuerySpy.getCalls()[0].args[0];

            expect(sqlQuery).is.a('string').to.contain("SELECT");
            expect(sqlQuery).is.a('string').to.contain("FROM users");
            expect(sqlQuery).to.match(/WHERE.*email=\$1/i);
        });
        
        it("should pass user's email to the SQL query", function() {
            var email = "user@mail.com";

            usersDao.findByEmail(email, null);
            var emailQueryParam = dbhelperQuerySpy.getCalls()[0].args[1][0];

            expect(emailQueryParam).is.a('string').equal(email);
        });
    });

    describe("add", function() {
        var user1 = new User(1, "Username", "email@email.com", "John Doe", "Password", "avatar-data", 1, true);

        it("should create a query that INSERTs into users table", function() {
            usersDao.add(user1, null);
            var sqlQuery = dbhelperInsertSpy.getCalls()[0].args[0];

            expect(sqlQuery).is.a('string').to.contain("INSERT");
            expect(sqlQuery).is.a('string').to.contain("INTO users");
        });

        it("should pass fields of user object to the SQL query", function() {
            usersDao.add(user1, null);
            var userQueryParam = dbhelperInsertSpy.getCalls()[0].args[1];

            expect(userQueryParam[0]).is.a('string').equal(user1.username);
            expect(userQueryParam[1]).is.a('string').equal(user1.email);
            expect(userQueryParam[2]).is.a('string').equal(user1.displayName);
            var userHash = require('crypto').createHash('sha256').update(user1.password).digest('base64');
            expect(userQueryParam[3]).is.a('string').equal(userHash);
            expect(userQueryParam[4]).is.a('number').equal(user1.role);
            expect(userQueryParam[5]).is.a('boolean').equal(user1.enabled);
        });
    });

    describe("delete", function() {
        it("should create a query that deletes users by ids", function() {
            usersDao.delete(1, null);
            var sqlQuery = dbhelperQuerySpy.getCalls()[0].args[0];

            expect(sqlQuery).is.a('string').to.contain("DELETE FROM USERS WHERE id");
        });

        it("should include ids in the query params", function() {
            var ids = [123412, 456345, 5635445643];

            usersDao.delete(ids, null);
            var idsQueryParam = dbhelperQuerySpy.getCalls()[0].args[1];

            expect(idsQueryParam).is.an('array').to.equal(ids);
        });
    });

    describe("update", function() {
        var user1 = new User(1, "Username", "email@email.com", "John Doe", "Password", "avatar-data", 1, true);
        var userHash = require('crypto').createHash('sha256').update(user1.password).digest('base64');
        user1.password = userHash;

        it("should create a query that updates users", function() {
            usersDao.update(user1, null);
            var sqlQuery = dbhelperQuerySpy.getCalls()[0].args[0];

            expect(sqlQuery).is.a('string').to.contain("UPDATE users SET");
        });

        it("should pass fields of user object to the SQL query", function() {
            usersDao.update(user1, null);
            var userQueryParam = dbhelperQuerySpy.getCalls()[0].args[1];

            expect(userQueryParam[0]).is.a('string').equal(user1.displayName);
            expect(userQueryParam[1]).is.a('string').equal(userHash);
            expect(userQueryParam[2]).is.a('number').equal(user1.role);
            expect(userQueryParam[3]).is.a('number').equal(user1.id);
            expect(userQueryParam[4]).is.a('string').equal(user1.email);
            expect(userQueryParam[5]).is.a('boolean').equal(user1.enabled);
        });
    });

    describe("getAvatar", function() {
        var user1 = new User(1, "Username", "email@email.com", "John Doe", "Password", "avatar-data", 1, true);
        it("should create a query that selects the avatar from the users table", function(){
            usersDao.getAvatar(user1.username, null);
            var sqlQuery = dbhelperQuerySpy.getCalls()[0].args[0];

            expect(sqlQuery).to.match(/SELECT.*avatar.*FROM users/i);
        });

        it("should pass the username to the SQL query", function() {
            usersDao.getAvatar(user1.username, null);
            var userQueryParam = dbhelperQuerySpy.getCalls()[0].args[1];

            expect(userQueryParam[0]).is.a('string').equal(user1.username);
        });
    });
});