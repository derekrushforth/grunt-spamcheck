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
                symbol: createGraph(figures.square, 40, response.score),
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
              symbol: createGraph(figures.square, 40, response.score),
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
    function createGraph(text, amount, tick) {
      var colors = ['green', 'yellow', 'red'],
          bgColors = ['bgGreen', 'bgYellow', 'bgRed'],
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
      var colors = ['green', 'yellow', 'red'];
      return colors[Math.round(tick/colors.length) - 1];
    }

    function getIcon(tick) {
      var icons = ['tick', 'warning', 'cross'];
      return icons[Math.round(tick/icons.length) - 1];
    }

    function clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }

  });

};