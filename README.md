# juve

> Assert performance metrics using phantomas

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install juve --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('juve');
```

## The "juve" task

### Overview
In your project's Gruntfile, add a section named `juve` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  juve: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.trials
Type: `Number`
Default value: `3`

The number of times each URL will be sampled.

#### options.olympic
Type: `Boolean`
Default value: `true`

Indicates whether or not to use olympic-style scoring. This will drop the largest and smallest values for each metric before averaging the trials. Only available when the number of trials is greater than three (3).

#### options.showpasses
Type: `Boolean`
Default value: `false`

Indicates whether or not to show successful metrics in the console.

#### options.baseUrl
Type: `String`
Default value: `http://localhost`

The URL base used for each task target. This will be prepended to the `url` option specified on each target.

#### options.url
Type: `String`
Default value: `/`

The URL to sample. This is combined with the `baseUrl` option to determine the full URL that will be sampled. 

#### options.asserts
Type: `Object`
Default value: `{}`

The list of metrics to assert. The keys of this object can be taken directly from the [phantomas documentation](https://github.com/macbre/phantomas#metrics). The values indicate a maximum acceptable value. If multiple trials are used, the results will be averaged and compared to the asserted value.

### Usage Examples

#### Default Options
In this example, the default options are used to sample a single page from a target site. This asserts that the page does not make any extra requests.

```js
grunt.initConfig({
  juve: {
    options: {
      baseUrl: 'http://some.url.com',
      asserts: {
        requests: 1
      }
    },

    home: {
      options: {
        url: '/home'
      }
    }
  }
});
```

#### Custom Options
In this example, some task options are overridden within the target. This can tighen or relax some options on a per-page basis.

```js
grunt.initConfig({
  juve: {
    options: {
      baseUrl: 'http://some.url.com',
      asserts: {
        requests: 1,
        timeToFirstByte: 200
      }
    },

    home: {
      options: {
        url: '/home',
        asserts: {
          requests: 2
        }
      }
    },

    about: {
      options: {
        url: '/about',
        asserts: {
          requests: 4,
          timeToFirstByte: 800
        }
      }
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. In lieu of a formal test suite, add test cases and fixtures to the project's Gruntfile.js to demonstrate/test things.

## Release History

### v0.1.0
- Basic functionality


_(working towards v0.2.0)_
