/*
 * grunt-spamcheck
 * https://github.com/derekrushforth/grunt-spamcheck.git
 */

'use strict';

var spamcheck = require('../lib/postmark-spamcheck');

module.exports = function(grunt) {

	grunt.registerMultiTask('spamcheck', 'Spam check your emails using Postmark\'s API', function() {

		var done = this.async(),
				options = this.options(),
				_data = this.data;

		if (this.files.length > 0) {

			// TODO: validate options
			// TODO: insert defaults

			// TODO: report should probably be a boolean instead of string
			var requestOptions = {
				options: _data.report || options.report
			};

			if (this.filesSrc.length > 1) {
				// TODO: support batch requests for multiple emails
			} else {
				requestOptions.email = grunt.file.read(this.filesSrc);

				spamcheck.getScore(requestOptions, function(err, response) {
					if (err) {
						grunt.log.warn('Error response: ' + JSON.stringify(err));
					} else {
						// TODO: colorize score based on number
						grunt.log.writeln('Spam check score: ✓ ' + response.score);
						grunt.log.writeln(JSON.stringify(response.report));
					}
					done();
				});

			}
		
		} else {
			grunt.log.warn('No src file found \n');
		}

	});


};