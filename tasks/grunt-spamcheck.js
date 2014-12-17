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

			var requestOptions = {
				options: _data.report || options.report || 'short'
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
						var color = (response.score > 5) ? 'green' : 'red',
								icon = (response.score > 5) ? '✓' : '✖';

						grunt.log.write('Spam check score: '['white'].bold);
						grunt.log.write(icon[color]);
						grunt.log.write(' ' + response.score[color].bold);

						// Show long report
						if (requestOptions.options === 'long') {
							grunt.log.writeln('');
							grunt.log.writeln('Report:'['white'].bold);
							grunt.log.writeln(response.report);
						}
						
					}
					done();
				});

			}
		
		} else {
			grunt.log.warn('No src file found \n');
		}

	});


};