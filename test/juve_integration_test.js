var juve = require('../lib/juve.js');

// Basic use cases
module.exports = {

	basic_usage: function (test) {
		test.expect(4);

		juve({

			trials: 1,
			url: 'http://localhost:9002/blank.html',
			assertions: { requests: 1 }

		}, function (passes, failures) {

			test.equal( passes.length, 1 );
			test.equal( passes[0].actual, 1 );
			test.equal( passes[0].expected, 1 );
			test.equal( passes[0].name, 'requests' );
			test.done();

		});
	},

	// Default options
	default_options: function (test) {
		test.expect(3);

		juve({
			url: 'http://localhost:9002/blank.html',
			assertions: {
				requests: 1,
				bodySize: 20
			}
		}, function (passes, failures, trials) {

			test.equal( passes.length, 1 );
			test.equal( failures.length, 1 );
			test.equal( trials.length, 3 );
			test.done();

		});
	},

	// Default options (no assertions)
	default_options_without_assertions: function (test) {
		test.expect(3);

		juve({
			url: 'http://localhost:9002/blank.html'
		}, function (passes, failures, trials) {

			test.equal( passes.length, 0 );
			test.equal( failures.length, 0 );
			test.equal( trials.length, 3 );
			test.done();

		});	
	}

};