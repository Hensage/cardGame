// JavaScript Document
const tls = require('tls');
tls.DEFAULT_MAX_VERSION = 'TLSv1.2';
const express = require('express');
const { PassThrough } = require('stream');
const e = require('express');
var username;
var fs = require('fs');
const { time } = require('console');
var app = express();
const http = require('http').Server(app);
//var https = require('https');
var privateKey  = fs.readFileSync('sslcert/domain.key', 'utf8');
var certificate = fs.readFileSync('sslcert/domain.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
//var httpsServer = https.Server(credentials, app);
const io = require('socket.io')(http);

app.use(express.static('static'));
app.use(express.json());
const router = express.Router();
app.use('/', router);
var savedResponse;
router.get('/', (req, res) => {
	res.sendFile(__dirname + '/templates/board.html'); //Serves the file
});

class user{
	constructor(sock){
		this.sock =sock; //Players socket id
		this.health = 100;
		this.timeCheck = new Date()
	}
}



var users = [];
var gameState = [-1,-1];
var worldState = 0;

io.on('connection', async (socket) => { //WHEN PLAYER JOINS
	users.push(new user(socket))
    /*
	if (users.length == 2){
		gameStart()
	}
    */
    d = await SyncEmit(socket,"testing",{"data":3});
    console.log("Hello")
    console.log(d);
	socket.on('disconnect', function() { //WHEN PLAYER DISCONNECTS
        console.log("BEEP")
	});
});


function SyncEmit(sock,event, data) {
	io.to(sock.id).emit(event,data)
	return new Promise((resolve, reject) => {
		sock.once("Yo", (id) => {
			console.log("Recieved");
			resolve(id);
		});
	});
}
http.listen(80, () => {
	console.log('listening on *:80');
  });