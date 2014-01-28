# juve

[![Build Status](https://secure.travis-ci.org/jared-stilwell/juve.png)](http://travis-ci.org/jared-stilwell/juve)

> Assert performance metrics using phantomas

A Node.js module that uses [Phantomas](https://github.com/macbre/phantomas) to run performance tests against a given URL. It features the ability perform multiple trials against the same URL and make assertions against the combined average metrics.

### Overview
To get started, require the `juve` module.

```js
var juve = require('juve');
```

This returns a function which accepts a configuration object and a callback with the following structure.

```js
juve({
  <options>
}, function (<passes>, <failures>, <trials>) {
  ...
});
```


### Options

#### options.trials
Type: `Number`
Default value: `3`

The number of times each URL will be sampled.

#### options.olympic
Type: `Boolean`
Default value: `false`

Indicates whether or not to use olympic-style scoring. This will drop the largest and smallest values for each metric before averaging the trials. Only available when the number of trials is greater than three (3).

#### options.url
Type: `String`
Default value: `/`

The URL to sample. This is combined with the `baseUrl` option to determine the full URL that will be sampled. 

#### options.asserts
Type: `Object`
Default value: `{}`

The list of metrics to assert. The keys of this object can be taken directly from the [phantomas documentation](https://github.com/macbre/phantomas#metrics). The values indicate a maximum acceptable value. If multiple trials are used, the results will be averaged and compared to the asserted value.

### Callback
The second argument to the `juve()` function is a callback that gets called once all the trials have completed and the combined results are gathered.

The first argument is an array of passing; the second argument is an array of failing results. The results in each array will look like:

```json
{
  "name": "some metric",
  "expected": "the asserted value",
  "actual": "the actual combined average"
}
```

The third (and optional) argument is an array of the response objects from each Phantomas trial.

### Usage Examples

#### Default Options
In this example, the default options are used to sample a single page from a target site. This asserts that the page does not make any extra requests.

```js
var juve = require('juve');

juve({

  url: 'http://some.site.com',
  asserts: {
    requests: 1
  }

}, function (passes, fails) {
  // do some things with the results.
});
```

#### Custom Options
In this example, some task options are overridden within the target. This can tighen or relax some options on a per-page basis.

```js
var juve = require('juve');

juve({
  
  url: 'http://some.site.com',
  asserts: {
    requests: 1,
    timeToFirstByte: 200
  }
}, function (passes, fails) {
  // do stuff with the results and stuff.
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## Release History

### v0.1.0
- Basic functionality

_(working towards v0.2.0)_
