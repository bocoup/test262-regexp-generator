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

var re = /\d+/gu;
var matchingRange = /[0-9]+/gu;
var msg = '"\\u{REPLACE}" should be in range for \\d+ with flags gu';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 0x10FFFF; i++) {
    str = String.fromCodePoint(i);
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));


    str += str;
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', String(i) + i));
}