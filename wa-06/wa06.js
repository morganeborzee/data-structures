const { Client } = require('pg');
const cTable = require('console.table');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'morgane';
db_credentials.host = 'ds-20.chrshhmqz35r.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: HERE address = '232 West 11th Street
var thisQuery = "SELECT address FROM aalocations WHERE address = '273 BOWERY New York NY ';"

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});