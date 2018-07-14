// Options
const CLIENT_ID = '1003164643399-upftvelv3vuhec6njag63kcph0c8pmq6.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'SteinerPL';


// Load auth2 library
 
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

// Init API client library and set up sign in listeners

function initClient() {
	gapi.client.init({
		discoveryDocs: DISCOVERY_DOCS,
		clientId: CLIENT_ID,
		scope: SCOPES
	}).then(() => {

		// Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
	});
}

// Update UI sign-in in state changes
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    content.style.display = 'block';
    videoContainer.style.display = 'block';
    getChannel(defaultChannel);
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    content.style.display = 'none';
    videoContainer.style.display = 'none';
  }
}

// Handle login
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
// Sign out
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// Get channel from API

function getChannel(channel) {
        gapi.client.youtube.channels.list({
          'part': 'snippet,contentDetails,statistics',
          'forUsername': 'GoogleDevelopers'
        })
        .then(function(response) {
        	console.log(response);
        	/*
          var channel = response.result.items[0];
          appendPre('This channel\'s ID is ' + channel.id + '. ' +
                    'Its title is \'' + channel.snippet.title + ', ' +
                    'and it has ' + channel.statistics.viewCount + ' views.');
                    */
        })
        .catch( err => alert('No Channel By That Name') );

}








