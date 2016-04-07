var records = [
    { id: 1, username: 'kainos', password: 'letmein', displayName: 'Kainos', emails: [ { value: 'jack@example.com' } ] }
    , { id: 2, username: 'admin', password: 'adminletmein', displayName: 'Admin', emails: [ { value: 'jill@example.com' } ] }
];

/**
 * This is stub implementation.  The intention is that ADSF or Google will be used
 * @param username
 * @param cb
 */
exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
}