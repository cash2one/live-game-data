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
var api_key = "RGAPI-ddcc7c3c-d0b0-4ff9-b5a0-0f2968cf122c";

//  Standard URL declarations for organization purposes
var base_url    = "https://na1.api.riotgames.com/lol/";
var api_key_url = "?api_key=" + api_key;

app.get('/:summoner_name', function(req, res) {

	var summoner_name = req.params.summoner_name;
	var summoner_url  = base_url + "summoner/v3/summoners/by-name/" + summoner_name + api_key_url;

	request(summoner_url, function(error, response, body) {	
		//var spectator_url = base_url + "spectator/v3/active-games/by-summoner/" + summoner_id + api_key_url;
		console.log(JSON.stringify(body).id);
		res.render('gameStats', {
        	summoner: body["id"]
    	});

	});

})

app.listen(3000, function() {
    console.log('Live Game Data listening on port 3000!');
});