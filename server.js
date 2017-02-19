//
// This simple web server written in Node responds with "Hello World" for every request.
//
var express		= require( 'express' );
var request 	= require( 'request' );
var bodyParser 	= require( 'body-parser' );
var botlogic 	= require( './botlogic.js' );

var app 		= express();
var app_port	= process.env.app_port || 8080;
var app_host	= process.env.app_host || '127.0.0.1';

// app use
app.use( bodyParser.json() );


// #################################################################
// #######################     ROUTING     #########################
// #################################################################

// --------------------------------------------
// function for homepage
// --------------------------------------------
app.get( '/', function( req, res ) {
	// render page
	res.sendFile( __dirname + '/index.html' );
});



// #################################################################
// function for HOOK!!!
// #################################################################
app.post( '/replywebinar/bot/hook', function( req, res ) {
	// get json
	var input = req.body;
	
	if( input.message ){
		var message 	= input.message;
		var messageid	= message.message_id;
		var chatid		= message.chat.id;
		var fromwho		= message.from.first_name;
		var messagetext	= message.text;
		var hookyou		= { method: 'sendMessage', chat_id: chatid, text: 'Error!' }; // parachute!
		
		// log
		console.log( 'Received message from ' + fromwho + ': ' + messagetext );
		
		if( messagetext === undefined ){
			res.send( hookyou );
			return;
		}
		
		// go for logic
		if( messagetext.startsWith( '/start' ) ) {
			hookyou['text'] = 'Bot started!';
		}
	}
	
	// send response
	res.setHeader( 'Content-Type', 'application/json' );
	res.send( hookyou );
});



// #################################################################
// #######################       GO!       #########################
// #################################################################

app.listen( app_port, function () {	
	console.log( 'Chatbots app listening on port ' + app_port );
});
