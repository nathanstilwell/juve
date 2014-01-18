/*
 * juve
 * https://github.com/jared-stilwell/juve
 *
 * Copyright (c) 2014 Jared Stilwell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    connect: {
      server: {
        options: {
          port: 9002,
          base: 'test/fixtures'
        }
      }
    },

    // Configuration to be run (and then tested).
    juve: {
      options: {
        baseUrl: 'http://localhost:9002'
      },

      blank_page: {
        options: {
          showpasses: true,
          url: '/blank',

          asserts: {
            requests: 1,
            domains: 1,

            // Page Performance
            timeToFirstByte: 200,
            onDOMReadyTime: 1000,
            windowOnLoadTime: 1200,
            timeToFirstJs: 800,

            // Assets
            multipleRequests: 0,
            smallImages: 0,

            // JS Bottlenecks
            documentWriteCalls: 0,
            evalCalls: 0
          }
        }
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['connect', 'juve']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
