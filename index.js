'use strict';

var concatStream = require('concat-stream');
var crossSpawn = require('cross-spawn-async');
var findVersions = require('find-versions');
var oneTime = require('one-time');

module.exports = function compassVersionCallback(options, cb) {
  if (cb === undefined) {
    cb = options;
    options = {};
  } else if (options === null || typeof options !== 'object') {
    throw new TypeError(String(options) + ' is not a valid option object. Expected an object.');
  }

  var cmd;
  var args = [];

  if (options.bundleExec) {
    cmd = 'bundle';
    args.unshift('exec', 'compass');
  } else {
    cmd = 'compass';
  }

  if (typeof cb !== 'function') {
    if (args.length !== 0) {
      cmd = cmd + ' ' + args.join(' ');
    }

    throw new TypeError(
      String(cb) +
      ' is not a function. Expected a callback function' +
      ' called after version check of `' + cmd + '` command.'
    );
  }

  cb = oneTime(cb);

  var concatStdout = concatStream({encoding: 'string'});
  var concatStderr = concatStream({encoding: 'string'});

  var spawnedProcess = crossSpawn(cmd, args.concat('version'), options)
  .on('error', cb)
  .on('close', function(code) {
    if (code !== 0) {
      // https://github.com/bundler/bundler/issues/4055
      cb(new Error(concatStderr.getBody() || concatStdout.getBody()));
    }

    cb(null, findVersions(concatStdout.getBody().trim(), {loose: true})[0]);
  });

  spawnedProcess.stdout.setEncoding('utf8');
  spawnedProcess.stdout.pipe(concatStdout);
  spawnedProcess.stderr.setEncoding('utf8');
  spawnedProcess.stderr.pipe(concatStderr);
};
