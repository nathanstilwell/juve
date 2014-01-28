var juve = require('../lib/juve.js');
var sinon = require('sinon');

// Config API
module.exports = {
	// Setup
	setUp: function (done) {
		this.url = 'http://some.url.com';
		this.config = {
			test: 'test'
		};

		this.adapter = sinon.spy(function (url, config, cb) {
			cb( null, { metrics: { requests: 1 } } );
		});

		done();
	},

	// Teardown
	tearDown: function (done) {
		this.url = undefined;
		this.config = undefined;
		this.adapter.reset();
		done();
	},

	// Using a single-part URL
	url: function (test) {
		var url;

		juve({
			adapter: this.adapter,
			url: this.url
		});

		url = this.adapter.args[0][0];

		test.expect(1);
		test.equal( url, this.url );
		test.done();
	},

	// Passing configuration options
	// through the to the adapter's CLI
	config: function (test) {
		var config;

		juve({
			adapter: this.adapter,
			url: null,
			config: {
				test: 1,
				'--user-agent': 'netscape'
			}
		});

		config = this.adapter.args[0][1];

		test.expect(2);
		test.ok( config['test=1'] );
		test.ok( config['--user-agent=netscape'] );
		test.done();
	},


	// Trial count
	trialCount: function (test) {
		test.expect(3);

		// Default trial count
		juve({
			adapter: this.adapter,
			url: null
		});

		test.equal( this.adapter.callCount, 3 );
		this.adapter.reset();


		// Custom trial count
		juve({
			adapter: this.adapter,
			url: null,
			trials: 5
		});

		test.equal( this.adapter.callCount, 5 );
		this.adapter.reset();


		// Single trial
		juve({
			adapter: this.adapter,
			url: null,
			trials: 1
		});

		test.equal( this.adapter.callCount, 1 );
		test.done();
	}
};

