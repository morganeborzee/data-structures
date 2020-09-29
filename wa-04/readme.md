PART ONE:

![Image of data modeling](https://github.com/github/morganeborzee/data-structures/IMG_2607.jpg)

In this part of the assignment I first replaces the credentials to connect to the RDS Postgres database and used .env to protect the password, then I created a table named aalocations with 3 columns.

```
const { Client } = require('pg');
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

// Sample SQL statement to create a table: 
 var thisQuery = "CREATE TABLE aalocations (address varchar(125), lat double precision, long double precision);";
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

```
After that I created a second .js file (b) and used the parse method to retrieve the information from the json object that I created for last week’s assignment. Then I used the async module and the method “eachSeries” to iterate and create each row by the total number of addresses. I had to use ‘E”’ in order to use comas in the address.

```
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

```
Lastly I’m using the “SELECT * FROM” query to visualize the table with the information of the Json file that I included in the previous part.


```
const { Client } = require('pg');  
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

// Sample SQL statement to query the entire contents of a table: 
var thisQuery = "SELECT * FROM aalocations;";

client.query(thisQuery, (err, res) => {
    console.log(err, res.rows);
    client.end();
});

```

