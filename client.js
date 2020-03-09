/*     SENG 513     */
/*   Assignment 3   */
/********************/
/*   Brandt Davis   */
/*     30019817     */
/* Lab Section B02  */
/********************/

var socket = io('http://localhost:3000');

var msgForm = document.getElementById("enterMessage");
var msgIn = document.getElementById("m");
var messages = document.getElementById("messages");

var topID = document.getElementById("top");

let name = "";
socket.emit('newUser', name);
console.log("YEYEYEEYEYEY");

$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('updateName', function(name){
    $('#top').append(" " + name);
  });


socket.on('chat message', function(msg, date, nickName){
    $();
    $('#messages').append($('<li>').text(nickName + ": " + msg + "\t\tsent on " + date[0] + ". " + date[1] + "/" + date[2] + " at " + date[3]));
});

socket.on('self message', function(date, nickName){
    $();
    $('#messages').append($('<li>').html("<b>" + nickName + ": " + msg + "</b>" + "\t\tsent on " + date[0] + ". " 
    + date[1] + "/" + date[2] + " at " + date[3]));
});
