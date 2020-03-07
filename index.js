
/*     SENG 513     */
/*   Assignment 3   */
/********************/
/*   Brandt Davis   */
/*     30019817     */
/* Lab Section B02  */
/********************/

var app = require('express')();
var path = require('path');
var http = require('http').createServer(app);

var io = require('socket.io')(http);

var server = require('http').Server(app);

var cookieParser = require('cookie-parser')
app.use(cookieParser())

// I used information in this link to serve my CSS file so I could separate code from the html file
// ---- https://stackoverflow.com/questions/44680410/serving-static-javascript-files-with-node-js-socket-io-and-express
   var express = require('express');
   app.use(express.static(path.join(__dirname, 'public')));
// --------------------------------------------------------------------------------------------------------------------

// Store possible nicknames for users in a global array
// along with a count of how many users are online
var nickNames = ["nick_cage", "ESPDude55", "datBoi", "Pepe", "Frogger"];
var numUsers = 0;

var activeUsers = {};


// This function takes a date objecnullt and 
// outputs the textual version of month 
// since getMonth() only returns a value of 0-11
// ---------------------------------------------
// Uses a dict to simply index the current month
function calcMonth(date){
  let monthNum = date.getMonth();
  let monthDict = {
    0 : "Jan",
    1 : "Feb",
    2 : "Mar",
    3 : "Apr", 
    4 : "May", 
    5 : "June", 
    6 : "July", 
    7 : "Aug", 
    8 : "Sept", 
    9 : "Oct",
    10 : "Nov",
    11 : "Dec"
  };
  return monthDict[monthNum];
}


// This function takes a date object and 
// outputs a nicely formatted string of hours, mintues, etc.
function calcTime(date){for (var socketid in io.sockets.sockets) {}
  let hour = date.getHours();
  let min = date.getMinutes(); 
  let time = "";

  // Check if hour is greater than 12, so we can convert
  // from 24 hr to 12 hr clock and add "pm"
  if(hour > 12) {
    time = String(hour-12) + ":" + min + "pm";
  }
  // Otherwise concat as needed and add "am"
  else {
    time = hour + ":" + min + "am";
  }
  return time;
}

var nickName = "yeye";

app.get('/', function(req, res){
  //res.send(req.cookies);
  console.log('Cookies: ', req.cookies);
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    
    console.log('a user connected');
    activeUsers[socket.id] = nickNames[numUsers];
    console.log(activeUsers[socket.id]);
    numUsers++;

    app.get('/', function(req, res){
      res.cookie("nickName2", nickName);
    });

    socket.on('chat message', function(msg, date, nickName){
        let d = new Date();         // Instantiate new Date object
        let month = calcMonth(d);   // Call calcMonth to get the string form of the current month
        let day = d.getDate();      // Get the current day of the month
        let year = d.getFullYear(); // Get the current year
        let time = calcTime(d);     // Get the current hour and minutes

        date = [month, day, year, time];  // Store date information in an array to emit to client

        nickName = activeUsers[socket.id];  

        io.emit('chat message', msg, date, nickName);
      });

    socket.on('disconnect', function(){
      numUsers--;
      console.log('user disconnected');
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});