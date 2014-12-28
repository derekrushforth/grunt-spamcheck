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
          var _requestOptions = clone(requestOptions);
          _requestOptions.email = item.content;

          spamcheck.getScore(_requestOptions, function(err, response) {
            if (err) {
              grunt.log.warn('Error response: ' + JSON.stringify(err));
            } else {
              
              // Create logging options
              var logOptions = {
                name: item.file,
                data: _data,
                response: response,
                requestOpts: requestOptions,
                symbol: createGraph(figures.square, response.score),
                icon: figures[getIcon(response.score)],
                scoreColor: getColor(response.score)
              };

              logResults(logOptions);
            }
          });
        });
      } else {
        requestOptions.email = grunt.file.read(this.filesSrc);

        spamcheck.getScore(requestOptions, function(err, response) {
          if (err) {
            grunt.log.warn('Error response: ' + JSON.stringify(err));
          } else {
            
            // Create logging options
            var logOptions = {
              name: that.filesSrc,
              data: _data,
              response: response,
              requestOpts: requestOptions,
              symbol: createGraph(figures.square, response.score),
              icon: figures[getIcon(response.score)],
              scoreColor: getColor(response.score)
            };

            logResults(logOptions);
          }
          done();
        });

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

    // TODO: need tests
    function createGraph(text, tick) {
      
      var tickLength = getTick(tick),
          current = 0,
          val = '';

      for (var i=0; i < colors.length; i++) {
        var color = colors[i],
            bg = bgColors[i];

        for (var x=0; x < graphLength/colors.length; x++) {
          current++;

          var obj = {
            score: current,
            color: color,
            icon: icons[i]
          };

          graphLegend.score.push(obj);

          if (current === tickLength) {
            val += chalk.white.bgWhite(figures.square);
          } else {
            val += chalk[color][bg](figures.square);
          }
          
        }
      }
      return val;
    }

    function getTick(tick) {
      if (tick > maxScore) { return graphLength; }

      var percent = (tick / maxScore) * 100,
          val = Math.round((percent/100)*graphLength);
          
      return val;
    }

    function getColor(tick) {
      if (tick > maxScore) { return colors[2]; }

      var scoreOptions = graphLegend.score[getTick(tick)-1];
      return scoreOptions.color;
    }

    function getIcon(tick) {
      if (tick > maxScore) { return icons[2]; }

      var scoreOptions = graphLegend.score[getTick(tick)-1];
      return scoreOptions.icon;
    }

    function clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }

  });

};