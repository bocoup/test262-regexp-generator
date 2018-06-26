// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range (Digit class escape)
info: |
    This is a generated test
features: [String.fromCodePoint]
---*/

var re = new RegExp('\d+', 'u');
var matchingRange = new RegExp('[0-9]+', 'u');
var msg = '"\\u{REPLACE}" should be in range for \\d+ with flags u';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 1114111; i++) {
    str = String.fromCodePoint(i);
    fromEscape = str.match(re);
    fromRange = str.match(re);
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));


    str += str;
    fromEscape = str.match(re);
    fromRange = str.match(re);
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', String(i) + i));
}