var juve = require('../lib/juve.js');

exports.basic_usage = function (test) {
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
};

exports.cached_trials = function (test) {
	test.expect(3);

	juve({

		trials: 2,
		url: 'http://localhost:9002/blank.html',
		assertions: { requests: 1 }

	}, function (passes, failures, trials) {

		test.equal( trials.length, 2 );

		test.equal( trials[0].metrics.requests, 1 );
		test.equal( trials[1].metrics.requests, 1 );
		test.done();

	});
};