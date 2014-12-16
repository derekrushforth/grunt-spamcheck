'use strict';

var http = require('http');

module.exports = {

	getScore: function(body, callback) {
		// TODO: Make callback optional
		// TODO: validate body

		var reqBody = JSON.stringify(body);

		var req = http.request({
			hostname: 'spamcheck.postmarkapp.com',
			path: '/filter',
			method: 'POST',
			port: 80,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(reqBody)
			}
		}, function(res) {
			var body = '';

			res.on('data', function(chunk) { 
				body += chunk; 
			});
			res.on('end', function() {
				// TODO: Check status code 200
				callback(null, JSON.parse(body));
			});
		});

		req.on('error', function(err) {
			callback(err, null);
		});

		req.write(reqBody);
		req.end();

	}
};