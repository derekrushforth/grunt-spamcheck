/*
 * grunt-spamcheck
 * https://github.com/derekrushforth/grunt-spamcheck.git
 */

'use strict';

var spamcheck = require('../lib/postmark-spamcheck'),
		figures = require('figures'),
		chalk = require('chalk');

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
						var icon = (response.score > 5) ? figures.tick : figures.cross,
								squares = createGraph(figures.square, 40, response.score),
								scoreColor = getColor(response.score);

						// Write score
						grunt.log.writeln('');
						grunt.log.write(chalk.bold.white('Spamcheck Score: '));
						grunt.log.write(chalk[scoreColor](icon));
						grunt.log.write(' ' + chalk[scoreColor](response.score));

						// Show graph
						if (!_data.hideGraph) {
							grunt.log.write(' ' + squares);
						}

						// Show long report
						if (requestOptions.options === 'long') {
							grunt.log.writeln('');
							grunt.log.writeln(chalk.bold.white('Report: '));
							grunt.log.writeln(response.report);
						}
						
					}
					done();
				});

			}
		
		} else {
			grunt.log.warn('No src file found \n');
		}

		// TODO: need tests
		function createGraph(text, amount, tick) {
			var colors = ['red', 'yellow', 'green'],
					bgColors = ['bgRed', 'bgYellow', 'bgGreen'],
					tickLength = getTick(amount, tick),
					current = 0;

			var val = '';

			for (var i=0; i < colors.length; i++) {
				var color = colors[i],
						bg = bgColors[i];

				for (var x=0; x < amount/colors.length; x++) {
					current++;

					if (current === tickLength) {
						val += chalk.white.bgWhite(figures.square);
					} else {
						val += chalk[color][bg](figures.square);
					}
					
				}
			}

			return val;
		}

		function getTick(amount, tick) {
			var percent = (tick / 10) * 100,
					val = Math.round((percent/100)*amount);

			return val;
		}

		function getColor(tick) {
			var colors = ['red', 'yellow', 'green'];
			return colors[Math.round(tick/colors.length) - 1];
		}

	});

	

};