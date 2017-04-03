var consul = require('consul')(),
    consulkv = require('../consul-kv'),
    consult = consulkv.consult
    testPassed = true;

console.log("Consul-kv self-test. Starting...");

// Set consul with values 
consul.kv.set("consul-kv/test/key1", "value-key-1", function(err, result) {
    if (err) {
        throw err;
        return;
    }
    // set key 3, but left key 2 undefined
    consul.kv.set("consul-kv/test/key3", "value-key-3", function(err, result) {
        if (err) {
            throw err;
            return;
        }
        // begin test
        // Pre-fill local cache with current values at server start 
        consulkv.init(["consul-kv/test/key1", "consul-kv/test/key2", "consul-kv/test/key3"], 0);
        consulkv.refresh(validateResults);
    });
});


function validateResults() {
    assertEqual("key1 test", consult("consul-kv/test/key1"), "value-key-1");
    assertEqual("key2 test", consult("consul-kv/test/key2"), false);
    assertEqual("key3 test", consult("consul-kv/test/key3"), "value-key-3");

    // Second test
    consul.kv.set("consul-kv/test/key3", "value-overwritten", function(err, result) {
        if (err) {
            throw err;
            return;
        }
        assertEqual("key3 2nd test: ", consult("consul-kv/test/key3"), "value-key-3");
        consulkv.refresh(function(){
            assertEqual("key3 3rd test: ", consult("consul-kv/test/key3"), "value-overwritten");
        });
    });
}

function assertEqual(what, expected, actual) {
    var thisTestPassed = (expected === actual);
    testPassed =  testPassed && thisTestPassed;
    console.log(what, thisTestPassed ? "OK" : "FAIL");
    return;
}
