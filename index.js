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

function buildContent(desc, pattern, range, max, flags, skip180e) {
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
var chunks = new Array(${max} / 2000);
var chunk;
var totalChunks = chunks.length;

for (codePoint = 0; codePoint < ${jsesc(max, { numbers: 'hexadecimal' })}; codePoint++) {
${skip180e ? '    if (codePoint === 0x180E) { continue; } // Skip 0x180E, addressed in a separate test file' : ''}
    // split strings to avoid a super long one;
    chunks[codePoint % totalChunks] = String.${method}(codePoint);
}

chunks.forEach(function(str) {
    var re = /${pattern}/${flags};
    var matchingRange = /${range}/${flags};
    var fromEscape = str.replace(re, '');
    var fromRange = str.replace(matchingRange, '');

    assert.sameValue(fromEscape, fromRange);
});
`;

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
    ].forEach(({quantifier, max = 0xFFFF, flags, suffix, posCb = u => [u], negCb = u => [u]}) => {
        flags += 'g';

        const pattern = `${escape}${quantifier}`;
        const range = rewritePattern(pattern, flags, {
            useUnicodeFlag: flags.includes('u')
        });

        console.log(pattern);
        console.log(range);
        console.log(`flags: ${flags}`);

        console.log('-------');

        const content = buildContent(desc, pattern, range, max, flags, skip180e);

        writeFile(desc, content, suffix);
    });
}
