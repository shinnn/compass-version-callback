# compass-version-callback

[![NPM version](https://img.shields.io/npm/v/compass-version-callback.svg)](https://www.npmjs.com/package/compass-version-callback)
[![Build Status](https://travis-ci.org/shinnn/compass-version-callback.svg?branch=master)](https://travis-ci.org/shinnn/compass-version-callback)
[![Build status](https://ci.appveyor.com/api/projects/status/jj1au1suxr2dvd94/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/compass-version-callback/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/compass-version-callback.svg)](https://coveralls.io/github/shinnn/compass-version-callback?branch=master)
[![Dependency Status](https://david-dm.org/shinnn/compass-version-callback.svg)](https://david-dm.org/shinnn/compass-version-callback)
[![devDependency Status](https://david-dm.org/shinnn/compass-version-callback/dev-status.svg)](https://david-dm.org/shinnn/compass-version-callback#info=devDependencies)

Callback-style version of [compass-version](https://github.com/shinnn/compass-version)

```javascript
const compassVersionCallback = require('compass-version-callback');

compassVersionCallback((err, version) => {
  if (err) {
    throw err;
  }

  version; //=> '1.0.3'
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install compass-version-callback
```

## API

```javascript
const compassVersionCallback = require('compass-version-callback');
```

### compassVersionCallback([*options*,] *callback*)

*options*: `Object` (directly passed to [`child_process#spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options))  
*callback*: `Function`

It detects the installed [Compass](http://compass-style.org/) version in `compass version` command.

#### options

In addition to `child_process#spawn`, you can set `bundleExec` option:

##### options.bundleExec

Type: `Boolean`  
Default: `false`

Detect the version in `bundle exec compass version`, instead of `compass version`.

#### callback(*error*, *version*)

*error*: `Error` when it fails to run `compass` (or `bundle exec compass`) command, otherwise `null`  
*version*: `String` (looks like `'1.0.3'`)

```js
const compassVersionCallback = require('compass-version-callback');

compassVersionCallback({bundleExec: true}, (err, version) => {
  if (err) {
    throw err;
  }

  version; //=> '1.0.3'
});
```

## Testing

Requires [Git](https://git-scm.com/), [Node](https://nodejs.org/) v4+ and [Docker machine](https://docs.docker.com/machine/).

1. [Clone](https://git-scm.com/docs/git-clone) this repository and [change CWD](http://pubs.opengroup.org/onlinepubs/9699919799/utilities/cd.html) to the cloned `compass-version-callback` directory.
2. Run [`npm install`](https://docs.npmjs.com/cli/install#synopsis).
3. [Create and run a container](https://docs.docker.com/machine/get-started/) with no additional settings.
4. Run [`npm test`](https://docs.npmjs.com/cli/test).

## License

Copyright (c) 2015 - 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
