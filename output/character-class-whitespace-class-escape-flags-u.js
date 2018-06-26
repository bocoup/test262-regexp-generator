// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range (Whitespace class escape)
info: |
    This is a generated test
features: [String.fromCodePoint]
---*/

var re = /\s/u;
var matchingRange = /[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]/u;
var msg = '"\\u{REPLACE}" should be in range for \\s with flags u';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 0x10FFFF; i++) {
    str = String.fromCodePoint(i);
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));
}