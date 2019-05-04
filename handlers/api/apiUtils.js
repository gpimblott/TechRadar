"use strict";

const ApiUtils= function () {
};

/**
 * Standard approach to returning results
 * @param res The response object
 * @param result The result returned from the
 */
ApiUtils.handleResultSet = function( res , result  , error ) {
    res.writeHead(200, {"Content-Type": "application/json"});

    let data = {};
    if ( result ) {
        data.result = result;
        data.success = true;
    } else {
        data.error = error;
        data.success = false;
    }
    res.end(JSON.stringify(data));
};

module.exports = ApiUtils;