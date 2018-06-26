// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range (Word class escape)
info: |
    This is a generated test
features: [String.fromCodePoint]
---*/

var re = new RegExp('\w', 'u');
var matchingRange = new RegExp('[0-9A-Z_a-z]', 'u');
var msg = '"\\u{REPLACE}" should be in range for \\w with flags u';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 1114111; i++) {
    str = String.fromCodePoint(i);
    fromEscape = str.match(re);
    fromRange = str.match(re);
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));
}