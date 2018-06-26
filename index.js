const fs = require('fs');
const rewritePattern = require('regexpu-core');
const slugify = require('slugify');
const filenamify = require('filenamify');
const jsesc = require('jsesc');
const header = require('./header');

const patterns = {
    'Non whitespace class escape': '\\S',
    'Whitespace class escape': '\\s',
    'Word class escape': '\\w',
    'Non Word class escape': '\\W',
    'Digit class escape': '\\d',
    'Non Digit class escape': '\\D',
};

function buildContent(desc, pattern, range, max, flags, double, skip180e) {
    let method;
    let features = [];

    if (max <= 0xFFFF) {
        method = 'fromCharCode';
    } else {
        method = 'fromCodePoint';
        features.push('String.fromCodePoint');
    }
    let content = header('prod-CharacterClassEscape', `Compare range for ${desc}, ${jsesc(pattern)} with flags ${flags}`, features);

    content += `
var re = /${pattern}/${flags};
var matchingRange = /${range}/${flags};
var msg = '"${jsesc('\\u{REPLACE}')}" should be in range for ${jsesc(pattern)} with flags ${flags}';

var i;
var fromEscape, fromRange, str;
for (i = 0; i < ${jsesc(max, { numbers: 'hexadecimal' })}; i++) {
${skip180e ? '    if (i === 0x180E) { continue; } // Skip 0x180E, addressed in a separate test file' : ''}
    str = String.${method}(i);
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', i));
`;

    if (double) {
        content += `

    str += str;
    fromEscape = !str.replace(re, 'test262');
    fromRange = !str.replace(re, 'test262');
    assert.sameValue(fromEscape, fromRange, msg.replace('REPLACE', String(i) + i));
`;
    }

    content += '}\n';

    return content;
}

function writeFile(desc, content, suffix = '') {
    const filename = `output/character-class-${slugify(filenamify(desc.toLowerCase()))}${suffix}.js`;
    fs.writeFileSync(filename, content);
}

// No additions
for (const [desc, escape] of Object.entries(patterns)) {
    const skip180e = escape.toLowerCase().includes('s');
    [
        {
            quantifier: '',
            flags: '',
        },
        {
            quantifier: '+',
            flags: '',
            posCb(u) { return [u, u+u]},
            suffix: '-plus-quantifier',
        },
        {
            quantifier: '+',
            flags: 'g',
            posCb(u) { return [u, u+u]},
            suffix: '-plus-quantifier-flags-g',
        },
        {
            quantifier: '',
            flags: 'u',
            max: 0x10FFFF,
            suffix: '-flags-u',
        },
        {
            quantifier: '+',
            flags: 'u',
            posCb(u) { return [u, u+u]},
            suffix: '-plus-quantifier-flags-u',
            max: 0x10FFFF,
        },
        {
            quantifier: '+',
            flags: 'gu',
            posCb(u) { return [u, u+u]},
            suffix: '-plus-quantifier-flags-gu',
            max: 0x10FFFF,
        },
    ].forEach(({quantifier, max = 0xFFFF, flags, suffix, posCb = u => [u], negCb = u => [u]}) => {
        const pattern = `${escape}${quantifier}`;
        const range = rewritePattern(pattern, flags);
        const double = !!(quantifier || flags.includes('g'));
        const content = buildContent(desc, pattern, range, max, flags, double, skip180e);

        writeFile(desc, content, suffix);
    });
}
