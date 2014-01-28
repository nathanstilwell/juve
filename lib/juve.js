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
var vow = require('vow');

function average (values) {
  var sum = values.reduce(function (total, next) {
    return total + next;
  });

  return sum / values.length;
}


// Drops the top and bottom values
// from a list of results. This
// can be used focus the precision
// of the results.
function olympic (values) {
  var results = values;
  var max, min;

  // Find and remove the maximum.
  max = Math.max.apply(null, results);
  results.splice( results.indexOf( max ), 1 );

  // Find and remove the minimum.
  min = Math.min.apply(null, results);
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

    if (value) {
      config[ option + '=' + value ] = true;
    }
  });

  return config;
}


module.exports = function (options, callback) {

  var phantomas = options.adapter || require('phantomas');
  var trialCount = options.trials || 3;
  var url = options.url;
  var assertions = options.asserts || [];
  var cachedTrials = [];
  var deferred = vow.defer();

  // Use olympic scoring by default, but
  // disallow its use when running less
  // than three trials.
  var olympicScoring = (trialCount < 3 ? false : (options.olympic || false));
  
  // Convert config properties into CLI-friendly arguments
  var config = parseArguments( options.config );

  try {

    // Run the trials in parallel, gathering
    // the results into a single array.
    async.times(trialCount, function(n, next) {

      phantomas(url, config, function (err, response) {
        cachedTrials.push( response );
        next( null, response.metrics );
      });

    }, function( err, trials ) {
      var properties = Object.keys( assertions );
      var passes = [];
      var failures = [];
      var results;

      properties.forEach( function (property) {
        var combined;
        var expected = assertions[ property ];

        var data = trials.map(function (result) {
          // Gather the property we are currently
          // attempting to assert.
          return result[ property ];
        });

        // If the assertion is a number
        if (isNumeric( expected )) {
          // Cut the top/bottom results
          // if using olympic-style scoring
          if (olympicScoring) {
            data = olympic( data );
          }

          // Average the results
          combined = Math.round( average( data ) );

          // Check the combined results
          // against the asserted value.
          try{
            // Make sure the average is equal or
            // below the asserted value.
            assert.isFalse( combined > expected, '');

            // The assertion passed.
            passes.push({
              name: property,
              expected: expected,
              actual: combined
            });

          } catch (err) {

            failures.push({
              name: property,
              expected: expected,
              actual: combined
            });

          }
        
        } else {
          // TODO: handle any non-numeric values
          // Diff the fields from the results
          // Message is diff if not equal to expectation
        }
      });

      results = {
        pass: passes,
        fail: failures,
        trials: cachedTrials
      };

      deferred.resolve( results );

      if (callback && typeof callback === 'function') {
        callback( results );
      }
    });

  // If something goes wrong, let's hear about it.
  } catch (err) {
    deferred.reject( err );
  }

  return deferred.promise();
};