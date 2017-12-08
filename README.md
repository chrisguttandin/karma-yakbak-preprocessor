# karma-yakbak-preprocessor

**A Karma preprocessor for yakbak.**

[![tests](https://img.shields.io/travis/chrisguttandin/karma-yakbak-preprocessor/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/karma-yakbak-preprocessor)
[![dependencies](https://img.shields.io/david/chrisguttandin/karma-yakbak-preprocessor.svg?style=flat-square)](https://www.npmjs.com/package/karma-yakbak-preprocessor)
[![version](https://img.shields.io/npm/v/karma-yakbak-preprocessor.svg?style=flat-square)](https://www.npmjs.com/package/karma-yakbak-preprocessor)

The `karma-yakbak-preprocessor` can be used to replace actual HTTP requests
whithin your tests with prerecorded responses. The way that works is by scanning
your files. All occurences of the given URLs will be replaced with the URL of a
local [yakbak](https://github.com/flickr/yakbak) server. The
`karma-yakbak-preprocessor` is starting these servers automatically.

## Installation

You can install the `karma-yakbak-preprocessor` via npm:

```shell
npm install karma-yakbak-preprocessor --save-dev
```

## Usage

The `karma-yakbak-preprocessor` expects an additional property called `yakbak`
whithin your karma configuration file. An example configuration might look like
this:

```js
// ...
yakbak: {
    autoStart: [
        'http://an-url.which/should-be-proxied/by-default'
    ],
    tapes: 'the/directory/of/your/tapes',
    replace: [
        'http://an-url.which/should-only-be-proxied/when-it-appears-in-a-test'
    ]
}
// ...
```
