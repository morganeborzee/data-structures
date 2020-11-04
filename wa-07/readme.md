### Assignment 7
Intro: In this assignment the code is divided in 5 parts corresponding to each step in the process needed to finish with a single SQL database with all the info both from the parsed HTML files but also from the TamuGeo API.

# 1st Part:
In this first part we are parsing information from the HTML files of the 10 zones, in order to parse all the information we are using functions like .trim .slice .split in some cases mixed with Regex to get exactly the data we need. We then push all the variables into one single JSON object, this object called meetingsData is composed by one array containing the right column information (address, building name, wheelchair access, indications) and within this array there is a second array containing the schedule of each meeting in each of the addresses.

```
// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');


for (let i = 1; i < 11; i++) {

    let filename = 'data/m' + i
    var content = fs.readFileSync(filename + '.txt');

    // load `content` into a cheerio object
    var $ = cheerio.load(content);


    var aa = new Object()
    aa.table = []



    let counter = 1;
    $('tr tr tr').each(function(i, outer_elem) {
        if (i > 0) {

            var Address = new Object()
            Address.meetings_list = new Array

            $(outer_elem).find('td').eq(0).each(function(i, elem) {

                if ($(elem).attr('style') === 'border-bottom:1px solid #e3e3e3; width:260px') {

                    Address.location_number = counter
                    Address.building_name = $(elem).html().split('</h4>')[0].trim().split("<h4 style=\"margin:0;padding:0;\">")[1]
                    Address.street_address = $(elem).html().split('<br>')[2].trim().split(",")[0]
                    Address.secondary_address = $(elem).html().split('<br>')[2].trim().split(',').splice(1, 2)[0].trim()
                    Address.meeting_name = $(elem).html().split('<br>')[1].trim().match(/\b(\d{1,3}\s|\d{1,3}nd\s|\d{1,3}rd\s|\d{1,3}st\s|\d{1,3}st\s|[A-Z\s])+\b.+?(?=-)/gm)[0]
                    Address.details = $(elem).find('div').text().trim()
                    Address.wheelchair = $(elem).text().trim().match(/(Wheelchair access)/gm)

                }


                counter++;


            })
            aa.table.push(Address)


            $(outer_elem).find('td').eq(1).each(function(i, elem) {

                // clean everything in this column:
                var meetingDump = $(elem).text().trim();


                meetingDump = meetingDump.replace(/[" "\t]+/g, " ");
                meetingDump = meetingDump.replace(/[\n|\r\n]/g, " ");
                meetingDump = meetingDump.split(/\s{11}/g);

                var meetingDumpTD = meetingDump[0].split(/\s{8}/g).map(function(e) {
                    return e.trim();
                });

                var mdSpecialInterest;
                for (var i = 0; i < meetingDumpTD.length; i++) {
                    var interest = meetingDumpTD[i].split('Special Interest')[1];

                    if (interest) {
                        mdSpecialInterest = interest.trim();
                    }
                    else {
                        mdSpecialInterest = '';
                    }
                    var meetType = meetingDumpTD[i].split('Type ')[1]

                    var meetTypeCode, meetTypeCodeName;


                    if (meetType) {
                        meetTypeCode = meetType.split(' ')[0];
                        if (meetType.match('Special')) {
                            meetTypeCodeName = meetType.split('= ')[1].split(' Special')[0];
                        }
                        else {
                            meetTypeCodeName = meetType.split('= ')[1];
                        }
                    }
                    else {
                        meetTypeCodeName = '';
                    }
                    var meetsplit = meetingDumpTD[i].split(' ');

                    var time_start = meetsplit[2];
                    var time_end = meetsplit[5]
                    var e_a_p = meetsplit[6];
                    var s_a_p = meetsplit[3];


                    // push into Meeting_Instance object
                    var Meeting_Instance = new Object();
                    Meeting_Instance.meeting_id = i + 1;
                    Meeting_Instance.typeCode = meetTypeCode;
                    Meeting_Instance.typeName = meetTypeCodeName;
                    Meeting_Instance.weekDay = meetsplit[0];
                    Meeting_Instance.startTime = time_start;
                    Meeting_Instance.startTime_amPm = s_a_p;
                    Meeting_Instance.endTime = time_end;
                    Meeting_Instance.endTime_amPm = e_a_p;
                    Meeting_Instance.interest = mdSpecialInterest;
                    // console.log(Address.meetings)

                    // meetings_list.push(Meeting_Instance)
                    Address.meetings_list.push(Meeting_Instance)

                } // for loop end
                // console.log(Address.meetings_list)

            }) //2nd find 

        }
    }) //overall find (tr)




    //console.log(aa.table[1].street_address)
    console.log(aa.table)
    fs.writeFileSync("data/parsed_data/parse_m" + i + ".json", JSON.stringify(aa.table));
    //
} // end of top for loop
```

# Part 2:

In this second part we are using the TamuGeo API service to get the latitude and longitude based on the different addresses. This is then pushed to the same JSON object called meetingsData.

```
"use strict"

// dependencies
const fs = require('fs'),
    querystring = require('querystring'),
    request = require('request'),
    async = require('async'),
    dotenv = require('dotenv');


// TAMU api key
 dotenv.config({ path: '/home/ec2-user/environment/.env' });
// dotenv.config();

const API_KEY = process.env.API_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx';

// let map9geo = 
for (let i = 1; i < 11; i++) {
    // geocode addresses
    let meetingsData = [];
    let filename = 'data/parsed_data/parse_m' + i

    let aa = fs.readFileSync(filename + '.json');


    //'/WeeklyAssignment7/CleaningScripts/test/'+ filename


    let addresses = JSON.parse(aa);

    //fs.readFileSync('/home/ec2-user/environment/WeeklyAssignment2/map9locations3.json'); //["63 Fifth Ave", "16 E 16th St", "2 W 13th St"]; ////Need to put read filesync here 

    // eachSeries in the async module iterates over an array and operates on each item in the array in series
    async.eachSeries(addresses, function(value, callback) {
            let query = {
                streetAddress: value.street_address,
                city: "New York",
                state: "NY",
                apikey: API_KEY,
                format: "json",
                version: "4.01"
            };

            // construct a querystring from the `query` object's values and append it to the api URL
            let apiRequest = API_URL + '?' + querystring.stringify(query);

            request(apiRequest, function(err, resp, body) {
                if (err) { throw err; }

                let tamuGeo = JSON.parse(body);
                 console.log(tamuGeo); //apiRequest); 


                let latlong = [];


                latlong.push(tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude']);
                latlong.push(tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude']);
                let tamuGeoFinal = new Object();
                tamuGeoFinal.StreetAddress = tamuGeo['InputAddress'];

                tamuGeoFinal.LatLong = latlong;
                value.GeoCoord = latlong;

                meetingsData.push(value);
            });

            // sleep for a couple seconds before making the next request
            setTimeout(callback, 2000);
        },

        function() {
            fs.writeFileSync('data/geocode_data/' + `map${i}geo.json`, JSON.stringify(meetingsData));
            console.log('*** *** *** *** ***');
            console.log(`Number of meetings in this zone: ${meetingsData.length}`);
            console.log(meetingsData)


        });
}
```

# Part 3

In this part we are creating a SQL table and setting the different columns/information that this table is going to contain. It is important to note that the primary key is called "ID serial primary key" and this basically is numeric list of all the entries contained.

```
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
```

# Part 4:

Here we are using a module called "pg-escape" to get rid of the apostrophes problem and we are inserting the information into the final SQL table. This is the same logic as the weekly assignment 4 instructions.

```
const { Client } = require('pg');
var async = require('async');
const dotenv = require('dotenv');
const fs = require('fs');
var escape = require('pg-escape');


dotenv.config({path: '../.env'});

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'morgane';
db_credentials.host = 'ds-20.chrshhmqz35r.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aa';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;


for (let i = 1; i <= 10; i++) { // loop through files with multiple meetings

    let addressesForDb = JSON.parse(fs.readFileSync(`data/geocode_data/map${i}geo.json`));

    async.eachSeries(addressesForDb, function(meeting, callback) { // loop through meetings 


        let meeting_list = meeting.meetings_list;

        async.eachSeries(meeting_list, function(slot, callback) { //loop through each time slot for each meeting
            const client = new Client(db_credentials);
            client.connect();
            // var thisQuery = "INSERT INTO aalocations VALUES (E'" + meeting.street_address + "', '"+meeting.GeoCoord+ "', '" + meeting.building_name+ "', '" + meeting.secondary_address + "', '" + 
            //     meeting.meeting_name+ "', '" + meeting.details + "', '" + meeting.wheelchair+ "', '" +slot.typeCode+ "', '" + slot.weekDay+ "', '" +slot.startTime+slot.startTime_amPm+ "', '" +slot.endTime+slot.endTime_amPm+ "', '" +
            //     slot.interest+"');"; 

            var thisQuery = escape("INSERT INTO aalocations VALUES (DEFAULT, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L )",
                meeting.street_address,
                meeting.GeoCoord,
                meeting.building_name,
                meeting.secondary_address,
                meeting.meeting_name,
                meeting.details,
                meeting.wheelchair,
                slot.typeCode,
                slot.typeName, //Meeting_Instance.typeName = meetTypeCodeName;
                slot.weekDay,
                slot.startTime + slot.startTime_amPm,
                slot.endTime + slot.endTime_amPm,
                slot.interest);


            console.log(thisQuery);
            client.query(thisQuery, (err, res) => {
                console.log(err, res);
                client.end();
            });
            setTimeout(callback, 1000);
        });
        setTimeout(callback, 1000);
    })
}
```

# Part 5
Lastly we want to make sure all the data has been written properly so we are using the same code as in for the assignment number 4 to select all and display all current data in the table that we just created. This is the last part of the exercise.

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

