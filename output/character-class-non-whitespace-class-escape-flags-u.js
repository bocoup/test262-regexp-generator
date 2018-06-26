// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range (Non whitespace class escape)
info: |
    This is a generated test
features: [String.fromCodePoint]
---*/

var re = new RegExp('\S', 'u');
var matchingRange = new RegExp('(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])', 'u');
var msg = '"\\u{REPLACE}" should be in range for \\S with flags u';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < 1114111; i++) {
    str = String.fromCodePoint(i);
    fromEscape = str.match(re);
    fromRange = str.match(re);
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));
}