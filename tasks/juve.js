/*
 * juve
 * https://github.com/jared-stilwell/juve
 *
 * Copyright (c) 2014 Jared Stilwell
 * Licensed under the MIT license.
 */

'use strict';

var async = require('async');
var assert = require('chai').assert;
var isNumeric = require('isnumeric');

module.exports = function ( grunt, adapter ) {

  var phantomas = adapter || require('phantomas');

  grunt.registerMultiTask('juve', function () {
    var opts = this.options();

    var trialCount = opts.trials || 3;
    var url = (opts.baseUrl || '') + opts.url;
    var assertions = opts.asserts || [];
    var showPasses = opts.showpasses || false;

    // Use olympic scoring by default, but
    // disallow its use when running less
    // than three trials.
    var olympicScoring = (trialCount < 3 ? false : opts.olympic || true);

    // This task is asynchronous
    var allDone = this.async();
    
    // Convert config properties into CLI-friendly arguments
    var config = parseArguments( opts.config );

    // Run the trials in parallel, gathering
    // the results into a single array.
    async.times(trialCount, function(n, next) {

      phantomas(url, config, function (err, response) {
        next( null, response.metrics );
      });

    }, function( err, trials ) {
      var passed = 0;
      var failed = 0;
      var properties = Object.keys( assertions );

      properties.forEach( function (property) {
        var combined;
        var expected = assertions[ property ];

        var results = trials.map(function (result) {
          // Gather the property we are currently
          // attempting to assert.
          return result[ property ];
        });

        // If the assertion is a number
        if (isNumeric( expected )) {
          // Cut the top/bottom results
          // if using olympic-style scoring
          if (opts.olympic) {
            results = olympic( results );
          }

          // Average the results
          combined = Math.round( average( results ) );

          // Check the combined results
          // against the asserted value.
          try{
            // Make sure the average is equal or
            // below the asserted value.
            assert.isFalse( combined > expected, '');

            // The assertion passed.
            passed += 1;

            if (showPasses) {
              pass( property, combined );
            }

          } catch (err) {
            // The assertion failed.
            failed += 1;
            fail( property, expected, combined );
          }
        
        } else {
          // TODO: handle any non-numeric values
          // Diff the fields from the results
          // Message is diff is not equal to expectation
        }
      });

      summary( passed, failed, properties.length );
      allDone();
    });
  });

  function pass (field, actual) {
    grunt.log.writeln(
      ('PASSED: ' + field).green +
      ' ' + actual.toString().grey
    );
  }

  function fail (field, expected, actual) {
    grunt.log.error(
      ('FAILED: ' + field).red +
      '\n\tactual: ' + actual +
      '\n\texpected: ' + expected
    );
  }

  function summary (passed, failed, total) {
    grunt.log.writeln('\n' +
      'failed: ' + failed + ', ' +
      'passed: ' + passed + ' ' +
      (' (' + ((passed / total) * 100).toFixed(2) + '%)').grey
    );
  }

  function average (values) {
    var sum = values.reduce(function (total, next) {
      return total + next;
    });

    return sum / values.length;
  }

  function olympic (values) {
    var results = values;
    var max, min;

    // Find and remove the maximum.
    max = Math.max.apply(results);
    results.splice( results.indexOf( max ), 1 );

    // Find and remove the minimum.
    min = Math.min.apply(results);
    results.splice( results.indexOf( min ), 1 );

    return results;
  }

  // This is necessary because the phantomas argument
  // API doesn't parse key:value arguments in the way
  // you might expect.
  // 
  // An config property like { 'disable-javascript': true }
  // will be parsed to the phantomas CLI correctly as a flag.
  // However, a key/value pair such as { 'user-agent': 'netscape' }
  // will be parsed to the CLI as --user-agent netscape,
  // which is wrong. It should be --user-agent=netscape instead.
  function parseArguments ( options ) {
    var config = {};

    Object.keys( options || {} ).forEach(function (option) {
      var value = options[ option ];

      if (isNumeric( value )) {
        config[ option + '=' + value ] = true;
      }
    });

    return config;
  }
};