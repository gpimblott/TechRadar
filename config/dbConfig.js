//expose our config directly to our application using module.exports
var username    = 'wiybmbxhbwspew';
var password    = '0yVodqS3ap4y7q0yZoblfvtYwk';
var host        = 'ec2-54-228-246-206.eu-west-1.compute.amazonaws.com';
var port        = 5432;
var dbname      = 'debmeboff0jsv2';
var timezone    = 'utc';
var useSSL = true;

// var username    = 'postgres';
// var password    = 'postgres';
// var host        = '192.168.99.100';
// var port        = 32770;
// var dbname      = 'radar';
// var timezone    = 'utc';
// var useSSL = false;

var cn = 'postgres://' + username +':' + password + '@' + host + ':' + port + '/' + dbname;

if( useSSL ) {
    cn += "?ssl=true";
}

var dbConfig = function () {
};

dbConfig.useSSL = function () {
    return useSSL;
}

dbConfig.getConnectionString = function () {
    return ( process.env.DATABASE_URL? process.env.DATABASE_URL : cn );
}


module.exports=dbConfig;