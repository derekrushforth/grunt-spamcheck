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

    	var requestOptions = {
        options: _data.options || options.options
      };

    	if (this.filesSrc.length > 1) {
    		// TODO: support batch requests for multiple emails
      } else {
        requestOptions.email = grunt.file.read(this.filesSrc);

        spamcheck.getScore(requestOptions, function(err, response) {
					if (err) {
            grunt.log.warn('Error response: ' + JSON.stringify(err));
          } else {
            grunt.log.writeln('Results:');
            grunt.log.writeln(JSON.stringify(response));
          }
          done();
        });

      }
    
    } else {
      grunt.log.warn('No src file found \n');
    }

  });


};
