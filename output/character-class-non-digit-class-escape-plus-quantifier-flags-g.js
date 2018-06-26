// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range (Non Digit class escape)
info: |
    This is a generated test
---*/

var re = new RegExp('\D+', 'g');
var matchingRange = new RegExp('[\0-\/:-\uFFFF]+', 'g');
var msg = '"\\u{REPLACE}" should be in range for \\D+ with flags g';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 65535; i++) {
    str = String.fromCharCode(i);
    fromEscape = str.match(re);
    fromRange = str.match(re);
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));


    str += str;
    fromEscape = str.match(re);
    fromRange = str.match(re);
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', String(i) + i));
}