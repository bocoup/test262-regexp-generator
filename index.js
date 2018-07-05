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

    let content = header(`Compare range for ${desc}, ${jsesc(pattern)} with flags ${flags}`);

    content += `
const chunks = [];
const totalChunks = Math.ceil(0x${max.toString(16)} / 0x10000);

for (let codePoint = 0; codePoint < ${jsesc(max, { numbers: 'hexadecimal' })}; codePoint++) {
    // split strings to avoid a super long one;
    chunks[codePoint % totalChunks] += String.fromCodePoint(codePoint);
}

const re = /${pattern}/${flags};
const matchingRange = /${range}/${flags};

const errors = [];

function matching(str) {
    return str.replace(re, '') === str.replace(matchingRange, '');
}

for (const str of chunks) {
    if (!matching(str)) {
        // Error, let's find out where
        for (const char of str) {
            if (!matching(char)) {
                errors.push('0x' + char.codePointAt(0).toString(16));
            }
        }
    }
};

assert.sameValue(
    errors.length,
    0,
    'Expected matching code points, but received: ' + errors.join(',')
);
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

        console.log(`${pattern} => ${range}, flags: ${flags}`);

        const content = buildContent(desc, pattern, range, max, flags, skip180e);

        writeFile(desc, content, suffix);
    });
}
