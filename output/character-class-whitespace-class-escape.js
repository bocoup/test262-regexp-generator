// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range (Whitespace class escape)
info: |
    This is a generated test
---*/

var re = new RegExp('\s', '');
var matchingRange = new RegExp('[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]', '');
var msg = '"\\u{REPLACE}" should be in range for \\s with flags ';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 65535; i++) {
    str = String.fromCharCode(i);
    fromEscape = str.match(re);
    fromRange = str.match(re);
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));
}