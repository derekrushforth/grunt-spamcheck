var assert = require('chai').assert,
		spamCheck = require('../lib/postmark-spamcheck');


var obj = {
	email: 'raw email dump',
	options: 'short'
};

describe('spamcheck', function() {
	this.timeout(30000);

	describe('getScore', function() {
		var response;

		beforeEach(function(done) {
			spamCheck.getScore(obj, function(err, res) {
				if (err) throw(err);
				response = res;
				done();
			});
		});

		it('should return a successful response from API', function() {
			assert.equal(response.success, true);
		});

		it('should return an error for malformed options', function() {
			// TODO: finish this
		});

		// TODO: check for optional callback
		// TODO: response is an object

	});

});