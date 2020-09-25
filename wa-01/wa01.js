// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');


/*
TRIED TO USE A LOOP BUT ONLY WORKS FOR THE LAST FILE
for (var i = 1; i < 9; i++) {

    request('https://parsons.nyc/aa/m0'+i+'.html', function(error, response, body){
        if (!error && response.statusCode == 200) {
            fs.writeFileSync('/home/ec2-user/environment/data/m0'+i+'.html', body);
        }
        else {console.log("Request failed!")}
    });
};
*/


request('https://parsons.nyc/aa/m01.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m01.html', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m02.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m02.html', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m03.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m03.html', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m04.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m04.html', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m05.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m05.html', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m06.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m06.html', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m07.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m07.html', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m08.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m08.html', body);
    }
    else {console.log("Request failed!")}
});

request('https://parsons.nyc/aa/m09.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m09.html', body);
    }
    else {console.log("Request failed!")}
});


request('https://parsons.nyc/aa/m10.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/m10.html', body);
    }
    else {console.log("Request failed!")}
});