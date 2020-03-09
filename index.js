
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

//var server = require('http').Server(app);

var cookieParser = require('cookie-parser')
app.use(cookieParser())

// I used information in this link to serve my CSS file so I could separate code from the html file
// ---- https://stackoverflow.com/questions/44680410/serving-static-javascript-files-with-node-js-socket-io-and-express
   var express = require('express');
   app.use(express.static(path.join(__dirname, 'public')));
// --------------------------------------------------------------------------------------------------------------------

// Store possible nicknames for users in a global array
// along with a count of how many users are online
var nameList = ["nick_cage", "ESPDude55", "datBoi", "crash", "Frogger", "Marsellus", "Jules"];
var usedNames = [];
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
  if(min < 10) {
    min = "0" + min;
  }
  if(hour > 12) {
    time = String(hour-12) + ":" + min + "pm";
  }
  // Otherwise concat as needed and add "am"
  else {
    time = hour + ":" + min + "am";
  }
  return time;
}


app.get('/', function(req, res){
  //res.send(req.cookies);
  //console.log('Cookies: ', req.cookies);
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){              
    numUsers++;

    console.log("New user connected! there are now " + numUsers + " users"); 
   
    // Check if the next nickName is already in use
    // --------------------------------------------
    // If so, iterate over all potential(default) nickNames until one is found
    // to not be in use, and assign the name in the normal way
    if(usedNames.includes(nameList[numUsers - 1])){
      for(var i = 0; i < nameList.length; i++){
        
        if(!usedNames.includes(nameList[i])){
          console.log("Used Names: " + usedNames);
          console.log("FOUND: " + nameList[i]);
          activeUsers[socket.id] = nameList[i];    // Store nickName as value in activeUsers dict
          usedNames.push(nameList[i]);  // Push the newly assigned nickName onto an array to keep track of
          break;
        }
      }
    }
    // Else, assign the name as normal
    else {
      console.log("Assigning names in the usual way for user: " + numUsers);
      activeUsers[socket.id] = nameList[numUsers - 1];  // Store nickName as value in activeUsers dict
      usedNames.push(nameList[numUsers - 1]);           // Push the newly assigned nickName onto an array to keep track of
    }

    name = activeUsers[socket.id];
    console.log("Selected name = " + name)
    console.log("The following names are currently in use: " + usedNames);
    console.log();
    socket.emit('updateName', name);

    socket.on('chat message', function(msg, date, nickName){
      let d = new Date();         // Instantiate new Date object
      let month = calcMonth(d);   // Call calcMonth to get the string form of the current month
      let day = d.getDate();      // Get the current day of the month
      let year = d.getFullYear(); // Get the current year
      let time = calcTime(d);     // Get the current hour and minutes

      date = [month, day, year, time];  // Store date information in an array to emit to client
      //nickName = setNickName(socket, numUsers)       //
      nickName = activeUsers[socket.id];

      let r = "";
      let g = "00";
      let b = "00";
      if(msg.includes("/nickcolor")){
        console.log("color updated");
      }

      let color = "#" + r + g + b;
      console.log(socket.id);
      // Send to all clients except sender
      socket.broadcast.emit('chat message', msg, date, nickName, color);

      // Send to only the sender
      socket.emit('self message', msg, date , nickName, color);
    });

    socket.on('disconnect', function(){
      //if(activeUsers.has(socket.id)) {
        for(var i = 0; i < usedNames.length; i++){
          if(usedNames[i] === activeUsers[socket.id]){
            console.log("removing " + usedNames[i] + " After " + activeUsers[socket.id] + " has left");
            usedNames.splice(i, 1);
            delete activeUsers[socket.id];
            console.log("Used names after deletion: " + usedNames);
            break;
          }
        }

      console.log("deleted socket " + socket.id);
      numUsers--;
      console.log("A user disconnected! There are now " + numUsers + " users"); 
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});