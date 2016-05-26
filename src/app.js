var pg = require('pg'); //
var express = require('express'); //
var bodyParser= require('body-parser');
var app = express(); //

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

app.use(bodyParser.urlencoded({extended: true}));

app.set ('views', './src/views');
app.set ('view engine', 'jade');

app.get ('/', function (req, res) {	
	pg.connect(connectionString, function (err, client, done) { 
		if(err) {
        	done();
        	return console.log(err);
        }

		client.query("select * from messages ORDER BY id ASC", function (err, result) {
			console.log(result.rows);
			res.render ('index', {board: result.rows});
			done();
			pg.end(); // the client will idle for another 30 seconds, temporarily preventing the app from closing, unless this function is called
		});
	});
});

app.post('/board', function (req, res) {

	pg.connect(connectionString, function (err, client, done) { 
	
		if(err) {
        	done();
        	return console.log(err);
        }

        // SQL Query > Insert Data
        client.query("insert into messages(title, body) values($1, $2)", [req.body.title, req.body.body]);
        console.log('saved to board');
        res.redirect('/');
	});
})

app.get ('/bulletinboard', function (req, res) {	
	pg.connect(connectionString, function (err, client, done) { 
		if(err) {
        	done();
        	return console.log(err);
        }

		client.query("select * from messages ORDER BY id ASC", function (err, result) {
			res.render ('board', {board: result.rows});
			done();
			pg.end(); // the client will idle for another 30 seconds, temporarily preventing the app from closing, unless this function is called
		});
	});
});

app.post('/delete', function(req, res) {

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          return console.log(err);
        }

        // SQL Query > Delete Data
        client.query("delete from messages where id=($1)", [req.body.deleteid]);
		console.log('deleted from board');
        res.redirect('/');
    });

});

var server = app.listen(3000, function () {
	console.log('Bulletin Board app listening on port: ' + server.address().port);
});