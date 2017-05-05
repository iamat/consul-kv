/**
 * Consul key/value reader + cache
 *
 * Responds sinchronously, but readas values asinchronously and stores them in cache
 *
 */

var consul = require('consul')(),
    cachedKeys = new Array(),
    cachedKeysUpdatedCount = 0,
    refreshInterval = 1 * 60 * 1000, // 1 minute
    intervalDescriptor;

module.exports = {
    init: function(keys, refreshInterval) {
        // set intial values
        for (var k in keys) cachedKeys[keys[k]] = false;

        // set refresh task
        if (refreshInterval > 0) {
            this.refresh();
            if (intervalDescriptor) {
                clearInterval(intervalDescriptor);
            }
            intervalDescriptor = setInterval( (function() {
                this.refresh();
            }).bind(this) , refreshInterval);
        }
    },

    consult: function(key) {
        if (cachedKeys.hasOwnProperty(key)) {
            return cachedKeys[key];
        }

        cachedKeys[key] = null;
        if (!intervalDescriptor) {
          module.exports.refresh();
          intervalDescriptor = setInterval( (function() {
            module.exports.refresh();
          }).bind(this), refreshInterval);
        }
        return cachedKeys[key];
    },

    refresh: function(callback) {
        cachedKeysUpdatedCount = 0;
        for (var k in cachedKeys) {
            consul.kv.get(k, function(err, result) {
                cachedKeysUpdatedCount++;
                  if (err) {
                      throw err;
                      return;
                  }
                  if (result && result.Key) {
                      cachedKeys[result.Key] = result.Value;
                }
                if (callback && (Object.keys(cachedKeys).length === cachedKeysUpdatedCount)) callback(); 
            });
        }
    }
}
