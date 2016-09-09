var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var users = require('../../../dao/users.js');
var apiutils = require('../../../handlers/api/apiUtils.js');
var userValidator  = require('../../../shared/validators/userValidator.js');

var apiUsers = require('../../../handlers/api/usersApiHandler.js');
var crypto = require('crypto');


describe("Users api handler", function() {
    var req, res;

    beforeEach(function() {
        req = res = {};
        res.end = sinon.spy();
        res.writeHead = sinon.spy();
    });

    describe("addUser", function() {
        var addUserSpy,
            testData = 12,
            apiUtilsSpy,
            validateNewPasswordSpy,
            validateUsernameSpy,
            validateEmailSpy;

        beforeEach(function() {
            req.body = {
                username: "test_username",
                email: "test@email.com",
                password: "test_password",
                password2: "test_password",
                displayName: "test displayName",
                role: '1',
                enabled: 'on'
            };

            addUserSpy = sinon.stub(users, 'add', function (username, email, displayName, password, admin, enabled, cb) {
                cb(testData);
            });
            apiUtilsSpy = sinon.stub(apiutils, 'handleResultSet', function(res, result, error) {
            });
            validateNewPasswordSpy = sinon.stub(userValidator, 'validateNewPassword', function(password, password2) {
                return {valid: password === password2};
            });
            validateUsernameSpy = sinon.stub(userValidator, 'validateUsername', function(username) {
                return {valid: true};
            });
            validateEmailSpy = sinon.stub(userValidator, 'validateEmail', function(email) {
                return {valid: true};
            });

        });

        afterEach(function() {
            users.add.restore();
            apiutils.handleResultSet.restore();
            userValidator.validateNewPassword.restore();
            userValidator.validateUsername.restore();
            userValidator.validateEmail.restore();
        });

        it("should call category dao with proper data", function() {
            apiUsers.addUser(req, res);

            sinon.assert.calledOnce(users.add);
            expect(addUserSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.body.username);
            expect(addUserSpy.getCalls()[0].args[1]).that.is.a('string').to.equal(req.body.email);
            expect(addUserSpy.getCalls()[0].args[2]).that.is.a('string').to.equal(req.body.displayName);
            expect(addUserSpy.getCalls()[0].args[3]).that.is.a('string').to.equal(req.body.password);
            expect(addUserSpy.getCalls()[0].args[4]).that.is.a('string').to.equal(req.body.role);
            expect(addUserSpy.getCalls()[0].args[5]).that.is.a('string').to.equal(req.body.enabled);
        });

        it("should generate response based on dao results", function() {
            apiUsers.addUser(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[1]).that.is.a('number').to.equal(testData);
        });

        it("should validate user data", function() {
            apiUsers.addUser(req, res);

            sinon.assert.calledOnce(userValidator.validateUsername);
            expect(validateUsernameSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.body.username);
            sinon.assert.calledOnce(userValidator.validateEmail);
            expect(validateEmailSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.body.email);
            sinon.assert.calledOnce(userValidator.validateNewPassword);
            expect(validateNewPasswordSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.body.password);
            expect(validateNewPasswordSpy.getCalls()[0].args[1]).that.is.a('string').to.equal(req.body.password2);
        });

        it("should respond with validation error when validation fails", function() {
            req.body.password2 = "fail_plz";
            apiUsers.addUser(req, res);

            sinon.assert.calledOnce(res.end);
            expect(res.end.getCalls()[0].args[0]).that.is.a('string').to.equal(JSON.stringify({success: false}));
        });

        describe("signUp", function() {
            it("should assign 'user' role to a new account", function() {
                req.body.role = 0; // try to set 'admin' role
                apiUsers.addUserSignUp(req, res);

                sinon.assert.calledOnce(users.add);
                expect(addUserSpy.getCalls()[0].args[4]).that.is.a('string').to.equal('1'); // 1 = 'user' role
            });
            it("should create a disabled account", function() {
                req.body.enabled = 'on'; // try to create an enabled account
                apiUsers.addUserSignUp(req, res);

                sinon.assert.calledOnce(users.add);
                expect(addUserSpy.getCalls()[0].args[5]).that.is.a('string').to.equal('no'); // 'no' = disabled account
            });
        });
    });

    describe("updateProfile", function() {
        var updateUserSpy,
            findByIdUserSpy,
            existingUserId = 12,
            errorMsg = 'mock error',
            userFromDbMock,
            apiUtilsSpy,
            validateNewPasswordChangeSpy,
            validateAvatarSpy,
            validateEmailSpy,
            updateError;

        beforeEach(function() {
            req.body = {
                email: "test@email.com",
                oldPassword: "old_password",
                password: "test_password",
                confirmPassword: "test_password",
                displayname: "test displayName",
                role: '0',
                enabled: 'no'
            };
            userFromDbMock = {
                id: 12,
                email: "test_db@email.com",
                password: crypto.createHash('sha256').update(req.body.oldPassword).digest('base64'),
                displayName: "test displayName_db",
                role: '1',
                enabled: 'on'
            };
            req.user = {id: existingUserId};
            req.file = {buffer: 'file_mock'};
            updateError = false;

            updateUserSpy = sinon.stub(users, 'update', function (id, email, displayName, passwordHash, avatarData, role, enabled, cb) {
                cb(id);
            });
            findByIdUserSpy = sinon.stub(users, 'findById', function (id, cb) {
                if (id === existingUserId) {
                    cb(null, userFromDbMock);
                } else {
                    cb(errorMsg, null);
                }

            });
            apiUtilsSpy = sinon.stub(apiutils, 'handleResultSet', function(res, result, error) {
            });
            validateNewPasswordChangeSpy = sinon.stub(userValidator, 'validateNewPasswordChange', function(password, password2, oldPassword) {
                return {valid: password === password2, message: password === password2 ? null : errorMsg };
            });
            validateAvatarSpy = sinon.stub(userValidator, 'validateAvatar', function(file) {
                return {valid: !!file};
            });
            validateEmailSpy = sinon.stub(userValidator, 'validateEmail', function(email) {
                return {valid: true};
            });

        });

        afterEach(function() {
            users.update.restore();
            users.findById.restore();
            apiutils.handleResultSet.restore();
            userValidator.validateNewPasswordChange.restore();
            userValidator.validateAvatar.restore();
            userValidator.validateEmail.restore();
        });

        it("should check whether appropriate user exists", function() {
            apiUsers.updateProfile(req, res);

            sinon.assert.calledOnce(users.findById);
            expect(findByIdUserSpy.getCalls()[0].args[0]).that.is.a('number').to.equal(req.user.id);
        });

        it("should validate user data", function() {
            apiUsers.updateProfile(req, res);

            sinon.assert.calledOnce(userValidator.validateAvatar);
            expect(validateAvatarSpy.getCalls()[0].args[0]).that.is.a('object').to.equal(req.file);
            sinon.assert.calledOnce(userValidator.validateEmail);
            expect(validateEmailSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.body.email);
            sinon.assert.calledOnce(userValidator.validateNewPasswordChange);
            expect(validateNewPasswordChangeSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.body.password);
            expect(validateNewPasswordChangeSpy.getCalls()[0].args[1]).that.is.a('string').to.equal(req.body.confirmPassword);
            expect(validateNewPasswordChangeSpy.getCalls()[0].args[2]).that.is.a('string').to.equal(req.body.oldPassword);
        });

        it("should respond with validation error when validation fails", function() {
            req.body.confirmPassword = "fail_plz";
            apiUsers.updateProfile(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[2]).that.is.a('string').to.equal(errorMsg);
        });

        it("should respond with error when user not found", function() {
            req.user.id = "fail_plz";
            apiUsers.updateProfile(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[2]).that.is.a('string').to.equal(errorMsg);
        });

        it("should respond with error when passwords do not match", function() {
            req.body.oldPassword = "fail_plz";
            apiUsers.updateProfile(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[2]).that.is.a('string').to.equal("Old password is incorrect");
        });

        it("should not validate avatar when no avatar selected", function() {
            req.file = null;
            apiUsers.updateProfile(req, res);

            sinon.assert.notCalled(validateAvatarSpy);
        });

        it("should not validate oldPassword match when not changing password", function() {
            req.password = req.confirmPassword = req.oldPassword = '';
            apiUsers.updateProfile(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[2]).is.undefined;
        });

        it("should update user with appropriate data", function() {
            apiUsers.updateProfile(req, res);

            sinon.assert.calledOnce(users.update);
            expect(updateUserSpy.getCalls()[0].args[0]).that.is.a('number').to.equal(req.user.id);
            expect(updateUserSpy.getCalls()[0].args[1]).that.is.a('string').to.equal(req.body.email);
            expect(updateUserSpy.getCalls()[0].args[2]).that.is.a('string').to.equal(req.body.displayname);
            expect(updateUserSpy.getCalls()[0].args[3]).that.is.a('string').to.equal(crypto.createHash('sha256').update(req.body.password).digest('base64'));
            expect(updateUserSpy.getCalls()[0].args[4]).that.is.a('string').to.equal(req.file.buffer);
        });

        it("should not allow to change the role", function() {
            userFromDbMock.role = '1'; //user role
            req.body.role = '0'; // admin role
            apiUsers.updateProfile(req, res); 

            sinon.assert.calledOnce(users.update);
            expect(updateUserSpy.getCalls()[0].args[5]).that.is.a('string').to.equal(userFromDbMock.role);
        });

        it("should not allow to disable the account", function() {
            userFromDbMock.enabled = 'on';
            req.body.enabled = 'no'; 
            apiUsers.updateProfile(req, res); 

            sinon.assert.calledOnce(users.update);
            expect(updateUserSpy.getCalls()[0].args[6]).that.is.a('string').to.equal(userFromDbMock.enabled);
        });

        it("should handle update result", function() {
            apiUsers.updateProfile(req, res);

            sinon.assert.calledOnce(users.update);
            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[1]).that.is.a('number').to.equal(req.user.id);
        });
    });

    describe("updateUser", function() {
        var updateUserSpy,
            findByIdUserSpy,
            existingUserId = '12',
            errorMsg = 'mock error',
            userFromDbMock,
            apiUtilsSpy,
            validateNewPasswordSpy,
            validateAvatarSpy,
            validateEmailSpy,
            updateError;

        beforeEach(function() {
            req.body = {
                email: "test@email.com",
                password: "test_password",
                confirmPassword: "test_password",
                displayname: "test displayName",
                role: '0',
                enabled: "on"
            };
            userFromDbMock = {
                id: 12,
                email: "test_db@email.com",
                password: "pass_hash",
                displayName: "test displayName_db",
                role: '1',
                enabled: "on"
            };
            req.params = {userId: existingUserId};
            req.file = {buffer: 'file_mock'};
            updateError = false;

            updateUserSpy = sinon.stub(users, 'update', function (id, email, displayName, passwordHash, avatarData, role, enabled, cb) {
                cb(id);
            });
            findByIdUserSpy = sinon.stub(users, 'findById', function (id, cb) {
                if (id === existingUserId) {
                    cb(null, userFromDbMock);
                } else {
                    cb(errorMsg, null);
                }

            });
            apiUtilsSpy = sinon.stub(apiutils, 'handleResultSet', function(res, result, error) {
            });
            validateNewPasswordSpy = sinon.stub(userValidator, 'validateNewPassword', function(password, password2) {
                return {valid: password === password2, message: password === password2 ? null : errorMsg };
            });
            validateAvatarSpy = sinon.stub(userValidator, 'validateAvatar', function(file) {
                return {valid: !!file};
            });
            validateEmailSpy = sinon.stub(userValidator, 'validateEmail', function(email) {
                return {valid: true};
            });

        });

        afterEach(function() {
            users.update.restore();
            users.findById.restore();
            apiutils.handleResultSet.restore();
            userValidator.validateNewPassword.restore();
            userValidator.validateAvatar.restore();
            userValidator.validateEmail.restore();
        });

        it("should check whether appropriate user exists", function() {
            apiUsers.updateUser(req, res);

            sinon.assert.calledOnce(users.findById);
            expect(findByIdUserSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.params.userId);
        });

        it("should validate user data", function() {
            apiUsers.updateUser(req, res);

            sinon.assert.calledOnce(userValidator.validateAvatar);
            expect(validateAvatarSpy.getCalls()[0].args[0]).that.is.a('object').to.equal(req.file);
            sinon.assert.calledOnce(userValidator.validateEmail);
            expect(validateEmailSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.body.email);
            sinon.assert.calledOnce(userValidator.validateNewPassword);
            expect(validateNewPasswordSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.body.password);
            expect(validateNewPasswordSpy.getCalls()[0].args[1]).that.is.a('string').to.equal(req.body.confirmPassword);
        });

        it("should respond with validation error when validation fails", function() {
            req.body.confirmPassword = "fail_plz";
            apiUsers.updateUser(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[2]).that.is.a('string').to.equal(errorMsg);
        });

        it("should respond with error when user not found", function() {
            req.params.userId = "fail_plz";
            apiUsers.updateUser(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[2]).that.is.a('string').to.equal(errorMsg);
        });

        it("should respond with error when passwords do not match", function() {
            req.body.confirmPassword = "fail_plz";
            apiUsers.updateUser(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[2]).that.is.a('string').to.equal(errorMsg);
        });

        it("should not validate avatar when no avatar selected", function() {
            req.file = null;
            apiUsers.updateUser(req, res);

            sinon.assert.notCalled(validateAvatarSpy);
        });

        it("should update user with appropriate data", function() {
            apiUsers.updateUser(req, res);

            sinon.assert.calledOnce(users.update);
            expect(updateUserSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.params.userId);
            expect(updateUserSpy.getCalls()[0].args[1]).that.is.a('string').to.equal(req.body.email);
            expect(updateUserSpy.getCalls()[0].args[2]).that.is.a('string').to.equal(req.body.displayname);
            expect(updateUserSpy.getCalls()[0].args[3]).that.is.a('string').to.equal(crypto.createHash('sha256').update(req.body.password).digest('base64'));
            expect(updateUserSpy.getCalls()[0].args[4]).that.is.a('string').to.equal(req.file.buffer);
            expect(updateUserSpy.getCalls()[0].args[5]).that.is.a('string').to.equal(req.body.role);
            expect(updateUserSpy.getCalls()[0].args[6]).that.is.a('string').to.equal(req.body.enabled);
        });

        it("should handle update result", function() {
            apiUsers.updateUser(req, res);

            sinon.assert.calledOnce(users.update);
            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[1]).that.is.a('string').to.equal(req.params.userId);
        });
    });

    describe("getAllUsers", function() {
        var getAllSpy,
            testData = '12';

        beforeEach(function() {
            getAllSpy = sinon.stub(users, 'getAll', function (cb) {
                cb(testData);
            });
        });

        afterEach(function() {
            users.getAll.restore();
        });

        it("should call user dao to retrieve users", function() {
            apiUsers.getAllUsers(req, res);

            sinon.assert.calledOnce(users.getAll);
        });

        it("should generate response based on dao results", function() {
            apiUsers.getAllUsers(req, res);

            sinon.assert.calledOnce(res.end);
            expect(res.end.getCalls()[0].args[0]).that.is.a('string').to.equal(JSON.stringify(testData));
        });
    });

    describe("deleteUsers", function() {
        var deleteSpy,
            apiUtilsSpy,
            testData = '12';

        beforeEach(function() {
            req.body = {id: 1};

            deleteSpy = sinon.stub(users, 'delete', function (ids, cb) {
                cb(testData);
            });
            apiUtilsSpy = sinon.stub(apiutils, 'handleResultSet', function(res, result, error) {
            });
        });

        afterEach(function() {
            users.delete.restore();
            apiutils.handleResultSet.restore();
        });

        it("should call user dao to delete users", function() {
            apiUsers.deleteUsers(req, res);

            sinon.assert.calledOnce(users.delete);
            expect(deleteSpy.getCalls()[0].args[0]).that.is.a('number').to.equal(req.body.id);
        });

        it("should generate response based on dao results", function() {
            apiUsers.deleteUsers(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[1]).that.is.a('string').to.equal(testData);
        });
    });

    describe("getAvatar", function() {
        var getAvatarSpy,
            apiUtilsSpy,
            errorMsg = 'mock error',
            validUsername = "valid_uname",
            testData = '12';

        beforeEach(function() {
            req.query = {username: validUsername};

            getAvatarSpy = sinon.stub(users, 'getAvatar', function (username, cb) {
                if (username === validUsername) {
                    cb(testData);
                } else {
                    cb(null, errorMsg)
                }
            });
            apiUtilsSpy = sinon.stub(apiutils, 'handleResultSet', function(res, result, error) {
            });
        });

        afterEach(function() {
            users.getAvatar.restore();
            apiutils.handleResultSet.restore();
        });

        it("should check whether username is supplied", function() {
            req.query.username = '';
            apiUsers.getAvatar(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[2]).that.is.a('string').to.equal("Username parameter missing");
        });

        it("should call getAvatar dao to retrieve the image", function() {
            apiUsers.getAvatar(req, res);

            sinon.assert.calledOnce(users.getAvatar);
            expect(getAvatarSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.query.username);
        });

        it("should respond with success when retrieval successful", function() {
            apiUsers.getAvatar(req, res);

            sinon.assert.calledOnce(res.end);
            expect(JSON.parse(res.end.getCalls()[0].args[0])).that.is.a('object').to.eql({success: true, result: testData.toString('base64')});
        });

        it("should respond with failure when retrieval unsuccessful", function() {
            req.query.username = "invalid_uname";
            apiUsers.getAvatar(req, res);

            sinon.assert.calledOnce(res.end);
            expect(JSON.parse(res.end.getCalls()[0].args[0])).that.is.a('object').to.eql({success: false, error: errorMsg});
        });
    });
});
