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

var re = /\w+/gu;
var matchingRange = /[0-9A-Z_a-z]+/gu;
var msg = '"\\u{REPLACE}" should be in range for \\w+ with flags gu';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 1114111; i++) {
    str = String.fromCodePoint(i);
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));


    str += str;
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', String(i) + i));
}