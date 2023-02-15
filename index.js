var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var app = express();
var server = http.createServer(app);


var db = new sqlite3.Database('./harman_c0849046.db');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./public/form.html'));
});

app.post('/fetch', function(req,res){
  db.serialize(()=>{
    db.each('select Shelf.ShelfLocation, Bin.BinID, PartNumber.PartNumber FROM PartNumber  INNER JOIN Bin ON PartNumber.BinID=Bin.BinID INNER JOIN Shelf ON Shelf.ShelfID=Bin.ShelfID WHERE PartNumber = ?', [req.body.partnumber], function(err,row){
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      res.send(` BinID: ${row.BinID}|    ShelfLocation: ${row.ShelfLocation} |    PartNumber: ${row.PartNumber}`);
    });
  });
});

server.listen(3000, function(){
  console.log("server is listening on port: 3000");
});

