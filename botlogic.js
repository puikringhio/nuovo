// #################################################################
// ######################       LOGIC       ########################
// #################################################################
var request		 			= require( 'request' );
var eol		 				= require( 'os' ).EOL;
var telegramSendMessageAPI	= 'https://api.telegram.org/bot339569893:AAHEVpgQOhtA9xvdzZ_LJpsf01e5pOYLey8/sendMessage';




// --------------------------------------------
// function for saying hello first time
// --------------------------------------------
exports.botSayHello = function( chatid ) {
	var hookyou	= { method: 'sendMessage', chat_id: chatid };
	
	try {
		hookyou['text'] = 'Hello! I am Reply bot';
	}
	catch( err ) {
		hookyou['text'] = 'Error: ' + err;
	}
	
	return hookyou;
};


// --------------------------------------------
// function for send status
// --------------------------------------------
exports.botSayStatus = function( chatid ) {
	
	var hookyou	= { method: 'sendMessage', chat_id: chatid, text: 'Ooops! Something went wrong!' }; // parachute 'text' in case of errors
	
	try {
		// getting data
		getSFDCstatus( chatid );
		
		hookyou['text'] = 'Ok, please wait...';
	}
	catch( err ) {
		hookyou['text'] = 'Error: ' + err;
	}
					
	return hookyou;
};


function getSFDCstatus( chatid ) {
	console.log( 'Called SFDC status' );
	var sfdcURL = 'https://api.status.salesforce.com/v1/instances/status/preview';	
	
	request(
		{
			url: sfdcURL
		},
		function( error, response, data ) {
			if( !error && response.statusCode === 200 ) {
				// parse data
				var jsondata 			= JSON.parse( data );
				var okCount 			= 0;
				var maintenanceCount 	= 0;
				var incidentCount 		= 0;
				for( var i in jsondata ){
					if( jsondata[i].status.includes('OK') ){
						okCount++;
					}
					if( jsondata[i].status.includes('MAINTENANCE') ){
						maintenanceCount++;
					}
					if( jsondata[i].status.includes('INCIDENT') ){
						incidentCount++;
					}
				}
				
				// create and send response
				var text = 'OK: ' + okCount + '\nMAINTENANCE: ' + maintenanceCount + '\nINCIDENT: ' + incidentCount;
				sendAsyncTextMessage( chatid, text );
			}
			else {
				console.log( 'Request KO during sfdc status request [' + sfdcURL + '] to chat [' + chatid + ']' );
			}
		}
	);
}



// --------------------------------------------
// ---------    PRIVATE SECTION    ------------
// --------------------------------------------
function sendAsyncTextMessage( chatid, text ) {
	console.log( 'Called send async message' );
	var sendMessageURL = telegramSendMessageAPI;	
	
	var postData = {
						method: 'sendMessage',
						chat_id: chatid,
						text: text
					};
	
	request.post(
		{
			url: sendMessageURL,
			body: postData,
			json: true
		},
		function( error, response, data ) {
			if( !error && response.statusCode === 200 ) {
				console.log( 'Request OK, async inline message sent [' + postData + '] to chat [' + chatid + ']' );
			}
			else {
				console.log( 'Request KO during async inline message delivery [' + postData + '] to chat [' + chatid + '] - ' + JSON.stringify(response) );
			}
		}
	);
}

