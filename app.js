// Create an Express Server
const express = require('express');
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 8080;

// Configure session middleware
app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUnitialized: true
  })
);

const options = {
  // self signed
  //key: fs.readFileSync('key.pem'),
  //cert: fs.readFileSync('cert.pem')
  // lets encrypt
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem')
};

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set Up Spotify API Integration
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  //redirectUri: 'http://localhost:8080/callback', // Your callback URL
  //redirectUri: 'https://localhost:8080', // Your callback URL
  redirectUri: 'https://stylishcar.pet',
});

// Implement OAuth2 Authentication
// Redirect to Spotify for authentication
app.get('/login', (req, res) => {
  const scopes = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing',
                  'user-library-read', 'user-library-modify'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// Callback route after successful authentication
app.get('/', async (req, res) => {
  const { code } = req.query;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    // Store tokens securely (e.g., in a database)
    // Store the access token in the session
    req.session.access_token = access_token;
    // Redirect the user to your playback control page
    res.redirect('/playback');
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send('Authentication failed');
  }
});

// Playback Page
app.use(express.static('public'));
app.set('views', __dirname);
app.set('third_parties', __dirname + '/third_party');
app.engine('html', require('ejs').renderFile);
app.engine('js', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('third_parties engine', 'js');
//app.use(express.static(__dirname));
app.get('/playback', (req, res) => {
  const accessToken = req.session.access_token;
  if (!accessToken) {
    return res.status(403).send('Access token not found');
  }
  res.render('playback', { accessToken });
});
app.get('/spotify-web-api.js', (req, res) => {
  res.render('spotify-web-api.js', {});
});

// Get information about the currently playing track
app.get('/current-track', async (req, res) => {
  try {
    const accessToken = req.session.access_token;
    if (!accessToken) {
      return res.status(403).send('Access token not found');
    }
    // spotify.setAccessToken(token)
    spotifyApi.setAccessToken(accessToken)
    const data = await spotifyApi.getMyCurrentPlayingTrack();
    const currentTrack = data.body.item;

    if (!currentTrack) {
      return res.send('No track is currently playing.');
    }
    //console.log('id2='+currentTrack.id)
    const liked = await spotifyApi.containsMySavedTracks([currentTrack.id])
    //console.log('liked2='+JSON.stringify(liked))
    const trackInfo = {
      title: currentTrack.name,
      artist: currentTrack.artists.map(artist => artist.name).join(', '),
      album: currentTrack.album.name,
      durationMs: currentTrack.duration_ms,
      albumCoverUrl: currentTrack.album.images[0].url,
      liked: liked.body[0],
      id: currentTrack.id,
    };

    res.json(trackInfo);
  } catch (error) {
    console.error('Error getting current track:', error);
    res.status(500).send('Error getting current track.');
  }
});

