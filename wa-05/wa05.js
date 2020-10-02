var async = require('async');  

var blogEntries = [];

class BlogEntry {
  constructor(primaryKey, sortKey, date, entry, goodday, emotions) {
    this.pk = {};
    this.pk.N = primaryKey.toString();
    this.sk = {};
    this.sk.N = sortKey.toString();
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.entry = {};
    this.entry.S = entry;
    this.goodday = {};
    this.goodday.BOOL = goodday; 
    if (emotions != null) {
      this.iate = {};
      this.iate.SS = emotions; 
    }
    this.month = {};
    this.month.N = new Date(date).getMonth().toString();
  }
}

blogEntries.push(new BlogEntry(20190510, 01, 'May 10 2019', "I love piano classes", true, ["Cheerful", "Excited"]));
blogEntries.push(new BlogEntry(20190617, 01, 'June 17, 2019', "My birthday!", true, ["Blessed"]));
blogEntries.push(new BlogEntry(20190617, 02, 'June 17, 2019', "I ate a trully amazing cake", true));
blogEntries.push(new BlogEntry(20200315, 01, 'March 15, 2020', "Omg, the world is falling apart", false, ["Scared", "Anxious"]));

console.log(blogEntries);

// SECOND PART

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-1";


async.eachSeries(blogEntries, function(value, callback) {
    
    var dynamodb = new AWS.DynamoDB();
    
    var params = {};
    params.Item = value; 
    params.TableName = "processblog-20";
    
    dynamodb.putItem(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
    setTimeout(callback, 1000); 
}); 