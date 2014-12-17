'use strict';

var http = require('http');

module.exports = {

	getScore: function(body, callback) {
		if (!callback) { throw('callback is required to get score'); return; }
		if (!this.validateBody(body)) { callback('Missing email field', null); return; }

		var reqBody = JSON.stringify(body);
		var reqOptions = {
			hostname: 'spamcheck.postmarkapp.com',
			path: '/filter',
			method: 'POST',
			port: 80,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(reqBody)
			}
		};

		// Make HTTP request to API
		var req = http.request(reqOptions, function(res) {
			var body = '';

			res.on('data', function(chunk) { 
				body += chunk; 
			});
			res.on('end', function() {
				if (res.statusCode === 200) {
					callback(null, JSON.parse(body));
				} else {
					callback('Server returned: ' + res.statusCode, null);
				}
				
			});
		});

		// Handle request error
		req.on('error', function(err) {
			callback(err, null);
			return;
		});

		req.write(reqBody);
		req.end();

	},

	validateBody: function(body) {

		if (!body.email) {
			return false
		} else {
			return true
		}

	}
};

