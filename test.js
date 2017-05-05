var consul = require('consul')();
var consulkv = require('../consult');
var consult = consulkv.consult;
var testPassed = true;

console.log('consult self-test. Starting...');

// Set consul with values
consul.kv.set('consult/test/key1', 'value-key-1', function (err, result) {
  if (err) {
    throw err;
  }
    // set key 3, but left key 2 undefined
  consul.kv.set('consult/test/key3', 'value-key-3', function (err, result) {
    if (err) {
      throw err;
    }
        // begin test
        // Pre-fill local cache with current values at server start
    consulkv.init(['consult/test/key1', 'consult/test/key2', 'consult/test/key3'], 0);
    consulkv.refresh(validateResults);
  });
});

function validateResults () {
  assertEqual('key1 test', consult('consult/test/key1'), 'value-key-1');
  assertEqual('key2 test', consult('consult/test/key2'), false);
  assertEqual('key3 test', consult('consult/test/key3'), 'value-key-3');

    // Second test
  consul.kv.set('consult/test/key3', 'value-overwritten', function (err, result) {
    if (err) {
      throw err;
    }
    assertEqual('key3 2nd test: ', consult('consult/test/key3'), 'value-key-3');
    consulkv.refresh(function () {
      assertEqual('key3 3rd test: ', consult('consult/test/key3'), 'value-overwritten');
    });
  });
}

function assertEqual (what, expected, actual) {
  var thisTestPassed = (expected === actual);
  testPassed = testPassed && thisTestPassed;
  console.log(what, thisTestPassed ? 'OK' : 'FAIL');
}
