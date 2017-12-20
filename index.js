var express    = require('express');
var bodyParser = require('body-parser');
var logger     = require('morgan');
var exphbs     = require('express-handlebars');
var _          = require('underscore');
var request    = require('request');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

//  Temporary development API key needs to be changed every day
var api_key = "RGAPI-7a670af7-4bbc-4a94-8b82-7ace3083e978";

//  Standard URL declarations for organization purposes
var base_url    = "https://na1.api.riotgames.com/lol/";
var api_key_url = "?api_key=" + api_key;


//  Endpoint after searching for a summoner name
app.get('/:summoner_name', function(req, res) {

	//  Set variables for summoner name and url
	var summoner_name = req.params.summoner_name;
	summoner_name     = summoner_name.replace("%20", " ");
	var summoner_url  = base_url + "summoner/v3/summoners/by-name/" + summoner_name + api_key_url;

	//  Empty arrays for each team
	var team1 = []; 
	var team2 = [];

	//  GET request for summoner data
	request(summoner_url, function(error, response, body) {	

		//  Set variable for summoner object
		var summoner = JSON.parse(body);

		//  Check for invalid summoner
		if (typeof summoner.status != "undefined" && summoner.status.message == "Data not found - summoner not found") {
			res.render('notFound', {
				message: "Summer not found"
			});
		} else {

			//  Build spectator url
			var spectator_url = base_url + "spectator/v3/active-games/by-summoner/" + summoner.id + api_key_url;

			//  GET request for ongoing match
			request(spectator_url, function(error2, response2, body2) {

				//  Set variables for current match and participants
				var match = JSON.parse(body2);

				//  Check if the summoner is in an ongoing match
				if (typeof match.status != "undefined" && match.status.message == "Data not found") {
					res.render("notFound", {
						message: "Selected summoner is not currently in a match"
					});
				} else {

					//  Get match participants
					var participants = match.participants;

					//  Populate team arrays
					for (var i = 0; i < participants.length; i++) {
						if (participants[i].teamId == 100) {
							team1.push(participants[i]);
						} else {
							team2.push(participants[i]);
						}
					}

					//  Render gateStats handlebars
					res.render('gameStats', {
						//  Team 1
        				summoner1 : team1[0].summonerName,
        				summoner2 : team1[1].summonerName, 
        				summoner3 : team1[2].summonerName, 
        				summoner4 : team1[3].summonerName, 
        				summoner5 : team1[4].summonerName,

        				//  Team 2
        				summoner6 : team2[0].summonerName,
        				summoner7 : team2[1].summonerName, 
        				summoner8 : team2[2].summonerName, 
        				summoner9 : team2[3].summonerName, 
        				summoner10: team2[4].summonerName,    
    				});

				}

			});

		}

	});

})

app.listen(3000, function() {
    console.log('Live Game Data listening on port 3000!');
});