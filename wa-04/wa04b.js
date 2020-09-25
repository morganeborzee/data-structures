const { Client } = require('pg');
var async = require('async');  
var fs = require('fs');  
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'morgane';
db_credentials.host = 'ds-20.chrshhmqz35r.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var addressesForDb = JSON.parse(fs.readFileSync('../wa-03/data/first.json'));

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES (E'" + value[2].StreetAddress + "', " + value[0] + ", " + value[1] + ");";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 