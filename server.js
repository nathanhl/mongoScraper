// Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');
var exhbs = require('express-handlebars');


app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static('public'));

mongoose.connect('mongodb://heroku_hh1fb970:8veosub1u77h11fn1l2lsrbhld@ds143707.mlab.com:43707/heroku_hh1fb970');
var db = mongoose.connection;

// show any errors
db.on('error', function(err){
	console.log('Mongoose connection error: ', err);
});

db.once('open', function(){
	console.log("Mongoose connection successful");
});

var Note = require('./models/Note.js');
var Article = require('./models/Article.js');


app.get('/', function(req, res){
	res.send(index.html);
});

// get request to scrape
app.get('/scrape', function(req, res){
	request('http://abcnews.go.com/', function(error, response, html){
		var $ = cheerio.load(html);

		$('h1').each(function(i, element){
			var result = {};
			result.title = $(this).children('a').text();
			
			result.link = $(this).children('a').attr('href');

			var entry = new Article (result);
			entry.save(function(err, doc){
				if(err) {
					console.log(err);
				} else {
					console.log(doc);
				}
			});

		});
	});

	res.send("Scrape Complete");
});

app.get('/articles', function(req, res){
	Article.find({}, function(err, doc){
		if(err){
			console.log(err);
		} else { res.json(doc); }
	});
});

app.get('/articles/:id', function (req, res){
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if(err){
			console.log(err)
		} else { res.json(doc) }
	});
});

app.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if (err) {
			console.log(err);
		} else {

			Article.findOneAndUpdate({'_id': req.params.id}, {'note': doc._id})
			.exec(function(err, doc){
				if(err){
					console.log(err);
				} else { res.send(doc); }
			});
		}
	});
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Listening to port", this.address().port);
});





