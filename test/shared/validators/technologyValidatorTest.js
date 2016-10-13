var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var validator = require('../../../shared/validators/technologyValidator.js');

describe("technologyValidator", function() {
    describe("validateTechnologyName", function() {
        var name,
            nameTooShortErr = "Technology Name too short",
            nameTooLongErr = "Technology Name too long",
            nameInvalidErr = "Technology name must start with a character/digit";

        beforeEach(function() {
            name = "Test technology 123";
        });

        it("should respond with valid true when technology name is valid", function() {
            var result = validator.validateTechnologyName(name);

            expect(result.valid).to.be.truthy;
        });

        it("should fail the validation when name too short", function() {
            name = "a";
            var result = validator.validateTechnologyName(name);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(nameTooShortErr);
        });

        it("should fail the validation when name undefined", function() {
            name = undefined;
            var result = validator.validateTechnologyName(name);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(nameTooShortErr);
        });

        it("should fail the validation when name null", function() {
            name = null;
            var result = validator.validateTechnologyName(name);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(nameTooShortErr);
        });

        it("should fail the validation when name too long", function() {
            name = "This technology name is too long 12345678901234567890";
            var result = validator.validateTechnologyName(name);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(nameTooLongErr);
        });

        it("should fail the validation when name contains illegal characters", function() {
            name = "Name % invalid";
            var result = validator.validateTechnologyName(name);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(nameInvalidErr);
        });

        it("should fail the validation when name doesn't start from alphanumeric char", function() {
            name = " Name invalid";
            var result = validator.validateTechnologyName(name);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(nameInvalidErr);
        });
    });

    describe("validateTechnologyWebsite", function() {
        var link,
            linkTooShortErr = "Technology website too short",
            linkTooLongErr = "Technology website too long";

        beforeEach(function() {
            link = "http://test.org";
        });

        it("should respond with valid true when link is valid", function() {
            var result = validator.validateTechnologyWebsite(link);

            expect(result.valid).to.be.truthy;
        });

        it("should fail the validation when link too short", function() {
            link = "a";
            var result = validator.validateTechnologyWebsite(link);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(linkTooShortErr);
        });

        it("should fail the validation when link undefined", function() {
            link = undefined;
            var result = validator.validateTechnologyWebsite(link);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(linkTooShortErr);
        });

        it("should fail the validation when link null", function() {
            link = null;
            var result = validator.validateTechnologyWebsite(link);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(linkTooShortErr);
        });

        it("should fail the validation when link too long", function() {
            link = "http://test.org?a=1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890";
            var result = validator.validateTechnologyWebsite(link);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(linkTooLongErr);
        });
    });

    describe("validateTechnologyLicenceWebsite", function() {
        var link,
            linkTooShortErr = "Technology licence website link too short",
            linkTooLongErr = "Technology licence website link too long";

        beforeEach(function() {
            link = "http://test.org";
        });

        it("should respond with valid true when link is valid", function() {
            var result = validator.validateTechnologyLicenceWebsite(link);

            expect(result.valid).to.be.truthy;
        });

        it("should fail the validation when link too short", function() {
            link = "a";
            var result = validator.validateTechnologyLicenceWebsite(link);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(linkTooShortErr);
        });

        it("should pass the validation when no link provided (undefined)", function() {
            link = undefined;
            var result = validator.validateTechnologyLicenceWebsite(link);

            expect(result.valid).to.be.truthy;
        });

        it("should pass the validation when no link provided (null)", function() {
            link = null;
            var result = validator.validateTechnologyLicenceWebsite(link);

            expect(result.valid).to.be.truthy;
        });

        it("should pass the validation when no link provided (empty)", function() {
            link = "";
            var result = validator.validateTechnologyLicenceWebsite(link);

            expect(result.valid).to.be.truthy;
        });

        it("should fail the validation when link too long", function() {
            link = "http://test.org?a=1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890" +
                "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890";
            var result = validator.validateTechnologyLicenceWebsite(link);

            expect(result.valid).to.be.falsy;
            expect(result.message).that.is.a("string").to.eql(linkTooLongErr);
        });
    });
});
