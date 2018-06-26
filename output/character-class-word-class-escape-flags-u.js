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

var re = /\w/u;
var matchingRange = /[0-9A-Z_a-z]/u;
var msg = '"\\u{REPLACE}" should be in range for \\w with flags u';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 0x10FFFF; i++) {
    str = String.fromCodePoint(i);
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));
}