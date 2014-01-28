var juve = require('../lib/juve.js');

// Basic use cases
module.exports = {

	basic_usage: function (test) {
		test.expect(4);

		juve({

			trials: 1,
			url: 'http://localhost:9002/blank.html',
			asserts: { requests: 1 }

		}, function (results) {

			test.equal( results.pass.length, 1 );
			test.equal( results.pass[0].actual, 1 );
			test.equal( results.pass[0].expected, 1 );
			test.equal( results.pass[0].name, 'requests' );
			test.done();

		});
	},

	// Default options
	default_options: function (test) {
		test.expect(3);

		juve({
			url: 'http://localhost:9002/blank.html',
			asserts: {
				requests: 1,
				bodySize: 20
			}
		}, function (results) {

			test.equal( results.pass.length, 1 );
			test.equal( results.fail.length, 1 );
			test.equal( results.trials.length, 3 );
			test.done();

		});
	},

	// Default options (no assertions)
	default_options_without_assertions: function (test) {
		test.expect(3);

		juve({
			url: 'http://localhost:9002/blank.html'
		}, function (results) {

			test.equal( results.pass.length, 0 );
			test.equal( results.fail.length, 0 );
			test.equal( results.trials.length, 3 );
			test.done();

		});	
	},

	// Returns a promise
	default_options_with_promise: function (test) {
		test.expect(3);

		juve({
			url: 'http://localhost:9002/blank.html',
			asserts: {
				requests: 1,
				bodySize: 20
			}
		}).then(function (results) {

			test.equal( results.pass.length, 1 );
			test.equal( results.fail.length, 1 );
			test.equal( results.trials.length, 3 );
			test.done();

		});
	}

};