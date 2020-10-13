Assignment 6

In the first part of the exercise I used the SELECT method to select specific data from the table that I previously created.

```
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

```

![Image of data modeling](https://github.com/morganeborzee/data-structures/blob/master/wa-06/images/query_1.png)

In the second part of this exercise I used the Dynamo query function to retrieve the entries from 17 June 2019.

```
// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "processblog-20",
    KeyConditionExpression: "pk = :theDate", // the query expression
    ExpressionAttributeValues: { // the query values
        ":theDate": {N: "20190617"}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});
```


![Image of data modeling](https://github.com/morganeborzee/data-structures/blob/master/wa-06/images/query_2.png)

