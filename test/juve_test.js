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

