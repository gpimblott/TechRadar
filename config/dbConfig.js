
var dbConfig = function () {
};

dbConfig.getConnectionString = function () {
    return ( process.env.DATABASE_URL );
}


module.exports=dbConfig;