// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range (Non Word class escape)
info: |
    This is a generated test
---*/

var re = /\W+/g;
var matchingRange = /[\0-\/:-@\[-\^`\{-\uFFFF]+/g;
var msg = '"\\u{REPLACE}" should be in range for \\W+ with flags g';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 0xFFFF; i++) {
    str = String.fromCharCode(i);
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));


    str += str;
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', String(i) + i));
}