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

    
    } else {
      grunt.log.warn('No src file found \n');
    }

  });


};
