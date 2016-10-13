/**
 * Cache module
 *
 * This keeps frequently used values loaded in memory to reduce database calls.
 * 
 * Currently:
 *  Statuses
 *  Categories
 *  "I've used this tech" options
 */
var categoryDao = require('./category.js');
var statusDao = require('./status.js');
var roleDao = require('./role.js');
var usedThisTechnologyDao = require('./usedThisTechnology.js');

var categories = null;
var statuses = null;
var roles = null;
var usedThisTechOptions = null;


var Cache = function () {
};


Cache.refresh = function ( app ) {
    categoryDao.getAll( function (results ) {
        categories = results;
        app.locals.categories = results;
    });
    
    statusDao.getAll( function (results ) {
        statuses = results;
        app.locals.statuses = results;
    })

    roleDao.getAll( function (results ) {
        roles = results;
        app.locals.roles = results;
    })

    usedThisTechnologyDao.getAllOptions( function (results ) {
        usedThisTechOptions = results;
        app.locals.usedThisTechOptions = results;
    });
}

Cache.getCategories = function() {
    return categories;
}

Cache.getCategory = function( value ) {
 
    for(var i=0;i<categories.length;i++) {
        var category = categories[i];
        if( category.name.toLowerCase() === value.toLowerCase()) {
            return category;
        }
    };
    return null;
}

Cache.getStatuses= function() {
    return statuses;
}

Cache.getStatus= function( value ) {

    for(var i=0;i<statuses.length;i++) {
        var status = statuses[i];
        if( status.name.toLowerCase() === value.toLowerCase()) {
            return status;
        }
    };
    return null;
}

Cache.getUsedThisTechOptions = function() {
    return usedThisTechOptions;
}

module.exports = Cache;
