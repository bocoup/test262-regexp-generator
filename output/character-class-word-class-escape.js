// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range (Word class escape)
info: |
    This is a generated test
---*/

var re = new RegExp('\w', '');
var matchingRange = new RegExp('[0-9A-Z_a-z]', '');
var msg = '"\\u{REPLACE}" should be in range for \\w with flags ';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 65535; i++) {
    str = String.fromCharCode(i);
    fromEscape = str.match(re);
    fromRange = str.match(re);
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));
}