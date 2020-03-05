var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// This function takes a date object and 
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
function calcTime(date){
  let hour = date.getHours();
  let min = date.getMinutes();
  let time = "";

  // Minutes under 10 only appear as a single digit
  // Check if it is single digit, and if so, prepend "0"
  if(min % 10 === min){
    min = "0" + String(min); 
  }
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

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg, date){
        let d = new Date();
        let month = calcMonth(d);
        let day = d.getDate();
        let year = d.getFullYear()
        let time = calcTime(d);

        date = [month, day, year, time];

        //console.log(date[0]);
        //console.log(date[1]);
        //console.log(date[2]);
        //console.log(date[3]);
        io.emit('chat message', msg, date);
      });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});