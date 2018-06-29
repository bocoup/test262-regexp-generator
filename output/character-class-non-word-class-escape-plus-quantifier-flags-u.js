// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: prod-CharacterClassEscape
description: >
    Compare range for Non Word class escape, \\W+ with flags u
info: |
    This is a generated test, please checkout https://github.com/bocoup/test262-regexp-generator
    for any changes.

    CharacterClassEscape[U] ::
        d
        D
        s
        S
        w
        W

    21.2.2.12 CharacterClassEscape
    
    The production CharacterClassEscape :: d evaluates as follows:
        Return the ten-element set of characters containing the characters 0 through 9 inclusive.
    The production CharacterClassEscape :: D evaluates as follows:
        Return the set of all characters not included in the set returned by CharacterClassEscape :: d.
    The production CharacterClassEscape :: s evaluates as follows:
        Return the set of characters containing the characters that are on the right-hand side of
        the WhiteSpace or LineTerminator productions.
    The production CharacterClassEscape :: S evaluates as follows:
        Return the set of all characters not included in the set returned by CharacterClassEscape :: s.
    The production CharacterClassEscape :: w evaluates as follows:
        Return the set of all characters returned by WordCharacters().
    The production CharacterClassEscape :: W evaluates as follows:
        Return the set of all characters not included in the set returned by CharacterClassEscape :: w.
features: [String.fromCodePoint]
---*/

var re = /\W+/u;
var matchingRange = /(?:[\0-\/:-@\[-\^`\{-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+/u;

var codePoint, str, msg;

function matching(str, pattern) {
    return str.replace(pattern, 'test262') === 'test262';
}

function assertSameRange(str, msg) {
    var fromEscape = matching(str, re);
    var fromRange = matching(str, matchingRange);
    assert(fromEscape === fromRange, msg);
}

function toHex(cp) {
    return '\\u{0x' + cp.toString(16) + '}';
}

for (codePoint = 0; codePoint < 0x10FFFF; codePoint++) {

    var msg = toHex(codePoint) +
        'should be in range for \\W+ with flags u';
    str = String.fromCodePoint(codePoint);

    assertSameRange(str, msg);


    msg = toHex(codePoint) + msg;
    str += str;
    assertSameRange(str, msg);
}
