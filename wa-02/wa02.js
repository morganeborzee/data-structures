var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('data/m02.html');

// load `content` into a cheerio object
var $ = cheerio.load(content);

var addressInfo = [];

// print (to the console) addresses
    $("td[style='border-bottom:1px solid #e3e3e3; width:260px']").each(function(i, elem) {
    var startAddress = $(elem).html();
    var finalAddress = startAddress.split('<br>')[2].trim().split(',')[0].split('(')[0];
    addressInfo.push(finalAddress);
    
});

fs.writeFileSync('addresses.json', JSON.stringify(addressInfo));


//fs.writeFileSync('wa-02/data/addresses.json', JSON.stringify(addressInfo));

