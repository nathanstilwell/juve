/*
 * juve
 * https://github.com/jared-stilwell/juve
 *
 * Copyright (c) 2014 Jared Stilwell
 * Licensed under the MIT license.
 */

'use strict';

var juve = require('../lib/juve.js');

module.exports = function ( grunt, adapter ) {

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

    // Do it!
    juve({

      trials: opts.trials,
      url: url,
      assertions: assertions

    }, function (passes, failures) {

      passes.forEach(function (result) {
        pass( result.name, result.actual );
      });

      failures.forEach(function (result) {
        fail( result.name, result.expected, result.actual );
      });

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
};