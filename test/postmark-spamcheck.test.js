var assert = require('chai').assert,
    nock = require('nock'),
    spamCheck = require('../lib/postmark-spamcheck');

var webApi = nock('http://spamcheck.postmarkapp.com');
var requestOptions = {
  email: 'raw email dump',
  options: 'short'
};

describe('spamcheck', function() {

  describe('getScore', function() {
    webApi.post('/filter').reply(200, {
      success: true,
      report: 'spamcheck report',
      score: 5.5
    });

    it('should return a successful response from API', function(done) {
      spamCheck.getScore(requestOptions, function(err, res) {
        assert.equal(res.success, true);
        done();
      });
    });

    it('should return an error if no email is passed in', function(done) {
      var obj = JSON.parse(JSON.stringify(requestOptions));
      delete obj.email;

      spamCheck.getScore(obj, function(err, res) {
        assert.equal(err, 'Missing email field');
        done();
      });
    });

  });

  describe('validateBody', function() {
    it('Should return false if no email field exists', function() {
      var obj = JSON.parse(JSON.stringify(requestOptions));
      delete obj.email;

      assert.equal(spamCheck.validateBody(obj), false);
    });

    it('Should return true if email field exists', function() {
      assert.equal(spamCheck.validateBody(requestOptions), true);
    });
  });

});