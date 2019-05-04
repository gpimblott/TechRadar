"use strict";

const debug = require('debug')('radar:version-api');

const sanitizer = require('sanitize-html');
const apiUtils = require('./apiUtils.js');
const versionsDao = require('../../dao/softwareVersions.js');

const SoftwareVersionsApiHandler = function () {
};

/**
 * Get all SoftwareVersions for a technology
 */
SoftwareVersionsApiHandler.getAllVersionsForTechnology = function (req, res) {
    const techId = sanitizer(req.params.technology);
    versionsDao.getAllForTechnology(techId, function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

/**
 * Add a new software version
 * @param req
 * @param res
 */
SoftwareVersionsApiHandler.addVersion = function (req, res) {
    const techId = sanitizer(req.body.technology);
    const name = sanitizer(req.body.name);

    versionsDao.add(techId, name, function (result, error) {
        apiUtils.handleResultSet(res, result, error);
    })
};

/**
 * Update the version of a technology
 * @param req
 * @param res
 */
SoftwareVersionsApiHandler.updateVersion = function (req, res) {
    const versionId = sanitizer(req.body.version);
    const name = sanitizer(req.body.name);

    req.checkBody('version', 'Invalid version ID').isInt();
    req.checkBody('name', 'Empty name').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.end(JSON.stringify({success: false, error: errors}));
        return;
    }

    versionsDao.update(versionId, name, function (result, error) {
        apiUtils.handleResultSet(res, result, error);
    })
};

/**
 * Delete versions
 * @param req
 * @param res
 */
SoftwareVersionsApiHandler.deleteVersions = function (req, res) {
    const versions = req.body.versions;

    versionsDao.delete(versions, function (result, error) {
        apiUtils.handleResultSet(res, result, error);
    })
};

module.exports = SoftwareVersionsApiHandler;