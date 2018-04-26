require("dotenv").config();
const keys = require("./keys");
const fs = require("fs");




function dispatch (command, param) {
  switch (command) {
  case 'my-tweets':
    // console.log(command);
    myTweets ();
    logCommand(command, "");
    break;
  case 'spotify-this-song':
    // console.log(command);
    mySpotify (param);
    logCommand(command, param);
    break;
  case 'movie-this':
    // console.log(command);
    myMovie (param);
    logCommand(command, param);
    break;
  case 'do-what-it-says':
    // console.log(command);
    myDoWhatItSays ();
    logCommand(command, "");
    break;
  default:
    console.log('Illegal Command!');
    return;
}}




//GLOBAL VARIABLES
let command = process.argv[2];
let param = process.argv[3];
dispatch (command, param);
// logCommand(command, param);

//Twitter
function myTweets() {
  const Twitter = require('twitter');
  // console.log(JSON.stringify(keys.twitter));
  var client = new Twitter(keys.twitter);
  var params = {screen_name: 'honestgraphics1'};
  client.get('statuses/user_timeline', params, 
  function(error, tweets, response) {
    if (!error) {
      for (let tweetNum = 0; tweetNum < 20; tweetNum++) {
        if (tweets[tweetNum] === undefined) {break;}
          console.log(tweets[tweetNum].created_at + ':   ' + tweets[tweetNum].text);
        }
      // console.log(tweets);
    } else {
      // console.log(error);
    }
  });
  console.log("working");
}

//Spotify
function mySpotify (param) {
  const Spotify = require('node-spotify-api');
  var client = new Spotify(keys.spotify);
  client.search({ type: 'track', query: param }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    let artists = [];
    for (let iNum = 0; iNum < data.tracks.items.length; iNum++) {
      for (let iArt = 0; iArt < data.tracks.items[iNum].album.artists.length; iArt++){
        artists.push(data.tracks.items[iNum].album.artists[iArt].name);
      }
      break;
    }  
  console.log('Artist(s): '+artists.join(', '));
  console.log('Song Name: '+param);
  console.log('Spotify Song Preview Link: '+data.tracks.items[0].preview_url);
  console.log('Album: '+data.tracks.items[0].album.name);
    }
  // console.log(data.tracks.items[0].album
  // console.log(data); 
  );
}

//OMDB
function myMovie (param) {
  var request = require('request');
  request('http://www.omdbapi.com/?t='
   + param + '&apikey=' + keys.omdb.omdb_api_key, function (error, response, body) {
    if (!error) {
      var json = JSON.parse(body);
      // console.log(body);
      console.log('Title:', json.Title);
      console.log('Year:', json.Year);
      console.log('IMDB Rating:', json.Rated);
      console.log('Rotten Tomatoes Rating:', json.Ratings.filter(
        function (doc) {
          return doc.Source === "Rotten Tomatoes";
        }
      )[0].Value);
      console.log('Country:', json.Country);
      console.log('Language:', json.Language);
      console.log('Plot:', json.Plot);
      console.log('Actors:', json.Actors);
}
});
}


function myDoWhatItSays () {
  fs.readFile('random.txt', "utf8", function(err, text) {
    if (!err) {
      let random = (text.split(","));
      let param2 = JSON.parse(random[1]);
      // console.log('song: '+song);
      dispatch (random[0], param2);
      // logCommand(random[0], param2);
    }
  });
}


// LOG COMMAND
function logCommand (command, param) {
  fs.appendFile('log.txt', "\n"+command+":  "+param, function (err){
    if (err) {
      console.log('Unable to update the log.');
    }
  });
}

