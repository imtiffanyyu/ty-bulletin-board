var pg = require('pg');
var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE messages(id serial, title text, body text)');
query.on('end', function() { client.end(); });