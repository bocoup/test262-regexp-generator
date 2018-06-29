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
    return '${jsesc('\\u')}{0x' + cp.toString(16) + '}';
}

for (codePoint = 0; codePoint < ${jsesc(max, { numbers: 'hexadecimal' })}; codePoint++) {
${skip180e ? '    if (codePoint === 0x180E) { continue; } // Skip 0x180E, addressed in a separate test file' : ''}
    var msg = toHex(codePoint) +
        'should be in range for ${jsesc(pattern)} with flags ${flags}';
    str = String.${method}(codePoint);

    assertSameRange(str, msg);
`;

    if (double) {
        content += `

    msg = toHex(codePoint) + msg;
    str += str;
    assertSameRange(str, msg);
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
