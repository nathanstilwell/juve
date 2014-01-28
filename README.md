# juve

[![Build Status](https://travis-ci.org/jared-stilwell/juve.png?branch=master)](https://travis-ci.org/jared-stilwell/juve)

> Assert performance metrics using phantomas

A Node.js module that uses [Phantomas](https://github.com/macbre/phantomas) to run performance tests against a given URL. It features the ability perform multiple trials against the same URL and make assertions against the combined average metrics.

### Overview
To get started, require the `juve` module.

```js
var juve = require('juve');
```

This returns a function which accepts a configuration object and a callback with the following structure.

```js
juve(<url for the page to test>, {
  <options>
}, function (<results>) {
  ...
});
```


### Options

#### options.adapter
Type: `Function`
Default value: [The Phantomas npm module](https://github.com/macbre/phantomas/wiki/npm-module)

Anything that supports a similar API could technically be used.

#### options.trials
Type: `Number`
Default value: `3`

The number of times each URL will be sampled.

#### options.olympic
Type: `Boolean`
Default value: `false`

Indicates whether or not to use olympic-style scoring. This will drop the largest and smallest values for each metric before averaging the trials. Only available when the number of trials is greater than three (3).
 

#### Assertions
The other keys of the options object can be taken directly from the [phantomas documentation](https://github.com/macbre/phantomas#metrics). The values indicate a maximum acceptable value. If multiple trials are used, the results will be averaged and compared to the asserted value.

### Callback
The second argument to the `juve()` function is a callback that gets called once all the trials have completed and the combined results are gathered.

The argument is an object with three array properties:
  - `pass`: passing assertions
  - `fail`: failed assertions
  - `trials`: all asserted metric for each trial.

The items in the `pass` and `fail` lists look like:

```javascript
{
  name: "some metric",
  expected: <the asserted value>,
  actual: <the actual combined average>
}
```

The items in the `trials` list is the raw results from the underlying adapter (i.e. Phantomas).

### Promise
As an alternative to passing a callback, the `juve` function returns a promise that will pass the results object when resolved.

```javascript
juve('http://some.site.com', {
  requests: 1
}).then(function (results) {
  // do some things with the results.
});
```

### Usage Examples

#### Default Options
In this example, the default options are used to sample a single page from a target site. This asserts that the page does not make any extra requests.

```js
var juve = require('juve');

juve('http://some.site.com', {
  requests: 1
}, function (results) {
  // do some things with the results.
});
```

#### Custom Options
In this example, some task options are overridden within the target. This can tighen or relax some options on a per-page basis.

```js
var juve = require('juve');

juve('http://some.site.com', {
  requests: 1,
  timeToFirstByte: 200
}, function (results) {
  // do stuff with the results and stuff.
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## Release History

### v0.1.3
- The `juve` function accepts the url as the first parameter.
- The `juve` function returns a promise in addition to accepting a callback.
- The `juve` function assumes all properties of the second parameter are assertions. The "options" property is reserved for specifying configuration options.
- Added travis-ci support.
- Added integration tests.

### v0.1.2
- Includes trials in the results.
- Better test coverage.

### v0.1.0
- Basic functionality

_(working towards v0.2.0)_
