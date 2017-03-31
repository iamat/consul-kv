# Consul Key/Value reader

A simple node.js wrapper arround [Consul](https://www.consul.io/intro/getting-started/kv.html), currently focused in storing and getting persistent key/values.

## Installation

```bash
npm install consul-kv
```

## Usage

1. Install *Consul* in your VM.
2. The library will connect an existing [Consul](https://www.consul.io/downloads.html)
   installation.
3. Include it into your app!

## Example

```javascript
const consulkv = require('consul-kv'),
	  consult = consulkv.consult;

// Pre-fill local cache with current values at server start 
consulkv.init(["key1", "key2", "key3", ...]);

// As a featureToggler, use it as follows:
if (consult("this") === "on") {
	// Code of the feature turned on
	// ...
}
```
