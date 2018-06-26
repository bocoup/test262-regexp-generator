// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range (Digit class escape)
info: |
    This is a generated test
---*/

var re = /\d/;
var matchingRange = /[0-9]/;
var msg = '"\\u{REPLACE}" should be in range for \\d with flags ';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 65535; i++) {
    str = String.fromCharCode(i);
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));
}