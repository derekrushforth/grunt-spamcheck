/*
 * grunt-spamcheck
 * ttps://github.com/derekrushforth/grunt-spamcheck.git
 */

module.exports = function(grunt) {

  grunt.initConfig({

    /* JSHint
    ------------------------------------------------- */
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    /* Mocha Tests
    ------------------------------------------------- */
    mochaTest: {
      unit: ['test/*.js'],
      options: {
        reporter: 'spec'
      }
    },


    /* Spamcheck
    ------------------------------------------------- */
    spamcheck: {
      template: {
        src: ['emails/template1.html', 'emails/template2.html', 'emails/template3.html']
      }
    },

  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'spamcheck']);
  grunt.registerTask('test', ['jshint', 'mochaTest']);

};