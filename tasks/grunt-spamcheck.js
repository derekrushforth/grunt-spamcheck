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

    var that = this,
        done = this.async(),
        options = this.options(),
        _data = this.data;

    // Graph and score settings
    var colors = ['green', 'yellow', 'red'],
        bgColors = ['bgGreen', 'bgYellow', 'bgRed'],
        icons = ['tick', 'warning', 'cross'],
        maxScore = 15,
        graphLength = 15,
        graphLegend = {
          score: []
        };

    if (this.files.length > 0) {

      var requestOptions = {
        options: _data.report || options.report || 'long'
      };

      if (this.filesSrc.length > 1) {
        var templates = [];

        // Iterate and construct src files
        this.filesSrc.forEach(function(path) {
          var obj = {
            file: path,
            content: grunt.file.read(path)
          };

          templates.push(obj);
        });

        // Iterate through templates
        templates.forEach(function(item) {
          // Create request options
          var _requestOptions = clone(requestOptions);
          _requestOptions.email = item.content;
          _requestOptions.file = item.file;

          // Make request
          apiRequest(_requestOptions);
        });
      } else {
        // Create request options
        requestOptions.email = grunt.file.read(this.filesSrc);
        requestOptions.file = this.filesSrc;

        // Make request
        apiRequest(requestOptions);
      }
    
    } else {
      grunt.log.warn('No src file found \n');
    }

    function logResults(options) {
      // TODO: Message based on score

      // Write score
      grunt.log.writeln(chalk.bold.white(options.name));
      grunt.log.write(chalk.bold.white('Spamcheck Score: '));
      grunt.log.write(chalk[options.scoreColor](options.icon));
      grunt.log.write(' ' + chalk[options.scoreColor](options.response.score));

      // Show graph
      if (!options.data.hideGraph) {
        grunt.log.write(' ' + options.symbol);
      }

      // Show long report
      if (options.requestOpts.options === 'long') {
        grunt.log.writeln('');
        grunt.log.writeln('');
        grunt.log.writeln('---- ---------------------- --------------------------------------------------');
        grunt.log.writeln(options.response.report);
      }
    }

    function apiRequest(requestOptions) {
      spamcheck.getScore(requestOptions, function(err, response) {
        if (err) {
          grunt.log.warn('Error response: ' + JSON.stringify(err));
        } else {
          //TESTSSTSTS
          //response.score = 12;
          logResults(generateOptions(response, requestOptions));
        }
      });
    }

    function generateOptions(response, requestOptions) {
      var opts = {
        name: requestOptions.file,
        data: _data,
        response: response,
        requestOpts: requestOptions,
        symbol: createGraph(figures.square, Math.floor(response.score)),
        icon: figures[getIcon(Math.floor(response.score))],
        scoreColor: getColor(Math.floor(response.score))
      };

      return opts;
    }

    function createGraph(text, score) {
      
      var current = 0,
          val = '';

      for (var i=0; i < colors.length; i++) {
        var color = colors[i],
            bg = bgColors[i];

        for (var x=0; x < graphLength/colors.length; x++) {
          current++;
          //console.log(current);

          var obj = {
            score: current,
            color: color,
            icon: icons[i]
          };

          graphLegend.score.push(obj);

          // Insert graph color
          if (score === 0 && current === 1) {
            // Check for a 0 score
            val += chalk.white.bgWhite(figures.square);
          } else if (current === score) {
            // Check if we are currently on the score
            val += chalk.white.bgWhite(figures.square);
          } else if(current === graphLength && score > graphLength) {
            // If the score exceeds the graph length
            val += chalk.white.bgWhite(figures.square);
          } else {
            // No match
            val += chalk[color][bg](figures.square);
          }
          
        }
      }
      return val;
    }

    function getColor(score) {
      if (score == 0) { return colors[0]; }
      if (score > maxScore) { return colors[2]; }
      console.log(graphLegend);
      return graphLegend.score[score-1].color;
    }

    function getIcon(score) {
      if (score == 0) { return icons[0]; }
      if (score > maxScore) { return icons[2]; }
      return graphLegend.score[score-1].icon;
    }

    function clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }

  });

};