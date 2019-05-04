"use strict";

const debug = require('debug')('radar:cache');
/**
 * Cache module
 *
 * This keeps frequently used values loaded in memory to reduce database calls.
 *
 * It is implmented as a Singleton - only ever exporting the same instance
 *
 * Currently:
 *  Statuses
 *  Categories
 *  Roles
 *  "I've used this tech" options
 */
const categoryDao = require('./category.js');
const statusDao = require('./status.js');
const roleDao = require('./role.js');
const usedThisTechnologyDao = require('./usedThisTechnology.js');



class Cache {

    constructor() {
        this.categories=null;
        this.statuses=null;
        this.roles=null;
        this.usedThisTechOptions=null;
    }


    refresh(app) {
        debug ("Caching frequently used data");

        let self = this;
        categoryDao.getAll(function (results) {
            self.categories = results;
            app.locals.categories = results;
        });

        statusDao.getAll(function (results) {
            self.statuses = results;
            app.locals.statuses = results;
        })

        roleDao.getAll(function (results) {
            self.roles = results;
            app.locals.roles = results;
        })

        usedThisTechnologyDao.getAllOptions(function (results) {
            self.usedThisTechOptions = results;
            app.locals.usedThisTechOptions = results;
        });
    }

    getCategories() {
        return this.categories;
    }

    getCategory(value) {

        for (let i = 0; i < this.categories.length; i++) {
            let category = this.categories[i];
            if (category.name.toLowerCase() === value.toLowerCase()) {
                return category;
            }
        }
        return null;
    }


    getStatuses() {
        return this.statuses;
    }


    getStatus(value) {

        for (let i = 0; i < this.statuses.length; i++) {
            let status = this.statuses[i];
            if (status.name.toLowerCase() === value.toLowerCase()) {
                return status;
            }
        }
        return null;
    }

    getUsedThisTechOptions() {
        return this.usedThisTechOptions;
    }

}

module.exports = new Cache();
