const { Client } = require('pg');
const dotenv = require('dotenv');
 dotenv.config({ path: '/home/ec2-user/environment/.env' });
//dotenv.config();



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

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE aalocations (ID serial primary key, Address varchar(1000), GeoCoord varchar(1000), Building_name varchar(1000), Secondary_address varchar(1000), Meeting_name varchar(1000), Details varchar(1000), Wheelchair varchar(1500), Meeting_code varchar(1000), Meeting_typeName varchar(1000), WeekDay varchar(1000), StartTime varchar(1000), EndTime varchar(1000), Special_interest varchar(1000))"
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
