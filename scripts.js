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

const defaultChannel = 'techguyweb';


// Form submit and change channel
channelForm.addEventListener('submit', e => {
	e.preventDefault();

	const channel = channelInput.value;
	getChannel(channel);

});


// Load auth2 library
 
const handleClientLoad = () => {
	gapi.load('client:auth2', initClient);
}

// Init API client library and set up sign in listeners

const initClient = () => {
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
const updateSigninStatus = (isSignedIn) => {
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
const handleAuthClick = (event) => {
  gapi.auth2.getAuthInstance().signIn();
}
// Sign out
const handleSignoutClick = (event) => {
  gapi.auth2.getAuthInstance().signOut();
}

// Display channel data
const showChannelData = (data) => {
	const channelData = document.getElementById('channel-data');
	channelData.innerHTML = data;
}


// Get channel from API

const getChannel = (channel) => {
  gapi.client.youtube.channels
  .list({
    part: 'snippet,contentDetails,statistics',
    forUsername: channel
  })
  .then( (response) => {
  	console.log(response);
  	
    const channel = response.result.items[0];
    const output = `
		<ul class="collection">
			<li class="collection-item">Title: ${channel.snippet.title}</li>
			<li class="collection-item">ID: ${channel.id}</li>
			<li class="collection-item">Subscribers: ${numberWithCommas(channel.statistics.subscriberCount)}</li>
			<li class="collection-item">View: ${numberWithCommas(channel.statistics.viewCount)}</li>
			<li class="collection-item">Videos: ${channel.statistics.videoCount}</li>
		</ul>
		<p>${channel.snippet.description}</p>
		<hr>
		<a class="btn grey darken-2" target="_blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
    `;

    showChannelData(output);

    const playlistId = channel.contentDetails.relatedPlaylist.uploads;
    requestVideoPlaylist(playlistId);
              
  })
  .catch( err => alert('No Channel By That Name') );
}



// Add commas to number
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const requestVideoPlaylist = (playlistId) => {
	const requestOptions = {
		playlistId: playlistId,
		part: 'snippet',
		maxResults: 10
	};

	const request = gapi.client.youtube.playlistItems.list(requestOptions);

	request.execute(response => {
		console.log(response);
	});
}




