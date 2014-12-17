# grunt-spamcheck v0.0.2

[![Code Climate](https://codeclimate.com/github/derekrushforth/grunt-spamcheck/badges/gpa.svg)](https://codeclimate.com/github/derekrushforth/grunt-spamcheck)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/derekrushforth/grunt-spamcheck.svg)](https://travis-ci.org/derekrushforth/grunt-spamcheck)

> Spam check your emails using [Postmark's](http://spamcheck.postmarkapp.com) API

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-spamcheck --save-dev
```

After the plugin is installed, it can be enabled in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-spamcheck');
```

## Spamcheck task
_Run this task with the `grunt spamcheck` command._


## Options

### report
Specifies whether you would like more detailed reporting.

Type: `String`
Default: `short`
Options: `short`, `long`


## Examples
This currently only supports a single template to be passed in.

```javascript
grunt.initConfig({
	spamcheck: {
		template: {
			report: 'long',
			src: ['emails/template1.html']
		}
	},
});
```

## Tests
_Run this task with the `grunt test` command._