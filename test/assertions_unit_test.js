var juve = require('../lib/juve.js');
var sinon = require('sinon');

// Assertions API
module.exports = {
	setUp: function (done) {
		// The results callback
		this.callback = sinon.spy();

		// Default to an empty metric set
		this.response = { metrics: {} };

		// Mock adapter that just returns the response
		this.adapter = function (url, config, cb) {
			cb( null, this.response );
		}.bind( this );

		done();
	},

	tearDown: function (done) {
		this.response = { metrics: {} };
		done();
	},


	// No Assertions
	none: function (test) {
		var passes, fails, trials;

		juve(null, { adapter: this.adapter, trials: 1 }, this.callback );

		results = this.callback.args[0][0];
		passes = results.pass;
		fails = results.fail;
		trials = results.trials;

		test.expect(3);
		test.equals( passes.length, 0 );
		test.equals( fails.length, 0 );
		test.equals( trials.length, 1 );
		test.done();
	},


	// Basic assertions
	basicPass: function (test) {
		var passes;

		// This represents passing
		// assertions since the result values
		// are less than or equal to the asserted values
		var result = { test1: 3, test2: 4 };
		var assertions = { test1: 4, test2: 4 };

		// Setup the response
		this.response = { metrics: result };

		juve(null, {
			adapter: this.adapter,
			trials: 1,
			asserts: assertions
		}, this.callback );
		
		// The passes from the first arg
		// of the first call
		passes = this.callback.args[0][0].pass;

		test.expect(3);
		test.equal( passes.length, 2 );
		test.equal( passes[0].name, 'test1' );
		test.equal( passes[1].name, 'test2' );
		test.done();
	},


	basicFail: function (test) {
		var fails;

		// This represents a failing
		// assertion since the result value
		// is greater than the asserted value
		var result = { test: 5 };
		var assertions = { test: 4 };

		// Setup the response
		this.response = { metrics: result };

		juve(null, {
			adapter: this.adapter,
			trials: 1,
			asserts: assertions
		}, this.callback );

		// The fails from the second arg
		// of the first call
		fails = this.callback.args[0][0].fail;

		test.expect(2);
		test.equal( fails.length, 1 );
		test.equal( fails[0].name, 'test' );
		test.done();
	},


	averagePass: function (test) {
		var passes;

		// This represents a passing
		// assertion since the combined
		// average of the results fall
		// below the asserted value.
		var i = 0;
		var results = [
			{ test: 1 },
			{ test: 5 },
			{ test: 3 }
		];

		var assertions = { test: 3 };

		// Reset the adapter to return the
		// next result each time it is called.
		this.adapter = function (url, config, cb) {
			cb( null, { metrics: results[ i++ ] } );
		};


		juve(null, {
			adapter: this.adapter,
			trials: 3,
			asserts: assertions
		}, this.callback );

		// The passes from the first arg of
		// the first call
		passes = this.callback.args[0][0].pass;

		test.expect(2);
		test.equal( passes.length, 1 );
		test.equal( passes[0].name, 'test' );
		test.done();
	},


	averageFail: function (test) {
		var results, passes, fails;

		// This represents a failing
		// assertion since the combined
		// average of the results falls
		// above the asserted value.
		var i = 0;
		var expected = [
			{ test: 1 },
			{ test: 9 },
			{ test: 2 }
		];

		var assertions = { test: 2 };

		// Reset the adapter to return the
		// next result each time it is called.
		this.adapter = function (url, config, cb) {
			cb( null, { metrics: expected[ i++ ] } );
		};


		juve(null, {
			adapter: this.adapter,
			trials: 3,
			asserts: assertions
		}, this.callback );

		results = this.callback.args[0][0];

		// The passes from the first arg of
		// the first call
		passes = results.pass;

		// The fails from the second arg of
		// the first call
		fails = results.fail;

		test.expect(5);
		test.equal( passes.length, 0, 'There should be no passing assertions.' );
		test.equal( fails.length, 1, 'There should be one failing assertion.' );
		test.equal( fails[0].name, 'test', 'The "test" assertion should have failed.' );
		test.equal( fails[0].expected, 2, 'The expected results should be 3.' );
		test.equal( fails[0].actual, 4, 'The actual combined result should be 4.' );
		test.done();
	},


	olympicScoring: function (test) {
		var results, passes, fails;
		
		// This represents a passing
		// assertion since the combined
		// average of the results fall
		// below the asserted value.
		var i = 0;
		var expected = [
			{ test1: 1, test2: 1 },
			{ test1: 9, test2: 7 },
			{ test1: 4, test2: 9 }
		];

		var assertions = { test1: 4, test2: 6 };

		// Reset the adapter to return the
		// next result each time it is called.
		this.adapter = function (url, config, cb) {
			cb( null, { metrics: expected[ i++ ] } );
		};


		juve(null, {
			adapter: this.adapter,
			trials: 3,
			asserts: assertions,
			olympic: true
		}, this.callback );

		results = this.callback.args[0][0];

		// The passes from the first arg of
		// the first call
		passes = results.pass;

		// The fails from the second arg of
		// the first call
		fails = results.fail;

		test.expect(8);
		test.equal( passes.length, 1, 'There should be no passing assertions.' );
		test.equal( passes[0].name, 'test1', 'The "test1" assertion should pass.' );
		test.equal( passes[0].expected, 4, 'The expected "test1" result should be 4.');
		test.equal( passes[0].actual, 4, 'The actual combined "test1" result should be 4.');

		test.equal( fails.length, 1, 'There should be one failing assertion.' );
		test.equal( fails[0].name, 'test2', 'The "test2" assertion fail.' );
		test.equal( fails[0].expected, 6, 'The expected "test2" result should be 6.' );
		test.equal( fails[0].actual, 7, 'The actual combined "test2" result should be 7.' );

		test.done();

	}

};