'use strong';

const {EOL} = require('os');

const compassVersionCallback = require('./');
const pify = require('pify');
const test = require('tape');

const execPromise = pify(require('child_process').exec, require('pinkie-promise'));

const COMPASS_VERSION = '1.0.3';

test('compassVersionCallback()', t => {
  t.strictEqual(compassVersionCallback.name, 'compassVersionCallback', 'should have a function name.');

  t.throws(
    () => compassVersionCallback('mkdir', t.fail),
    /TypeError.*mkdir is not a valid option object\. Expected an object\./,
    'should throw a type error when it takes two argument but the first is not an object.'
  );

  t.throws(
    () => compassVersionCallback(null, t.fail),
    /TypeError.*null is not a valid option object\. Expected an object\./,
    'should throw a type error when the first argument is a falsy value.'
  );

  t.throws(
    () => compassVersionCallback(1),
    /TypeError.*1 is not a function\. .*called after version check of `compass` command\./,
    'should throw a type error when the first argument is neither a function nor an object.'
  );

  t.throws(
    () => compassVersionCallback({bundleExec: true}, null),
    /TypeError.*null is not a function\. .*called after version check of `bundle exec compass` command\./,
    'should throw a type error when the last argument is not a function.'
  );

  t.throws(
    () => compassVersionCallback({stdio: 123}, t.fail),
    /TypeError.*stdio/,
    'should pass the option object to childProcess#spawn.'
  );

  t.end();
});

test('compassVersionCallback() with `bundleExec` option before running `bundle install`', t => {
  t.plan(1);

  compassVersionCallback({bundleExec: true}, err => {
    t.equal(
      err.message,
      [
        'bundler: command not found: compass',
        'Install missing gem executables with `bundle install`',
        ''
      ].join(EOL),
      'should pass an error to the callback.'
    );
  });
});

test('compassVersionCallback() with `bundleExec` option after running `bundle install`', t => {
  t.plan(2);

  execPromise('bundle install --path=vendor').then(() => {
    compassVersionCallback({bundleExec: true}, (err, version) => {
      t.strictEqual(err, null, 'should not pass any errors to the callback.');
      t.equal(version, COMPASS_VERSION, 'should detect proper compass version.');
    });
  }).catch(t.fail);
});

test('compassVersionCallback() before `compass` installed', t => {
  t.plan(1);

  compassVersionCallback(err => {
    t.equal(err.code, 'ENOENT', 'should pass an error to the callback.');
  });
});

test('compassVersionCallback() after `compass` installed', t => {
  t.plan(2);

  execPromise(`gem install compass --version ${COMPASS_VERSION} --no-document`).then(() => {
    compassVersionCallback((err, version) => {
      t.strictEqual(err, null, 'should not pass any errors to the callback.');
      t.equal(version, COMPASS_VERSION, 'should detect proper compass version.');
    });
  }).catch(t.fail);
});
