var categoryDao = require('./category.js');

var categories = null;


var Cache = function () {
};

Cache.refresh = function () {
    categoryDao.getAllValues( function ( results ) {
        categories = results;
    });
}

Cache.getCategories = function() {
    return categories;
}

module.exports = Cache;
