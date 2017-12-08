# Status: **!!! DEPRECATED !!!**

This module is deprecated. As the name of this module implies, it depends on
[yakbak](https://github.com/flickr/yakbak) which hasn't been updated for a
while. In the meantime some of yakbak's dependencies have been reported to have
security vulnerabilities. It's therefore not really possible to keep this module
in a healthy condition and that's why it's deprecated now.

# karma-yakbak-preprocessor

**!!! DEPRECATED !!! A Karma preprocessor for yakbak.**

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
