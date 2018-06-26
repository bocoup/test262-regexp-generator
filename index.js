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

function buildContent(desc, reStr, positives, negatives) {
    const content = [
        header('prod-CharacterClassEscape', `Compare range (${desc})`),
        `var re = ${reStr};`,
        '\n// Positives values',
        ...positives.map(index => `assert.sameValue('${index}'.replace(re, 'test262'), 'test262', '${jsesc(index)} should match ${jsesc(reStr)}');`),
        '\n// Negative values',
        ...negatives.map(index => `assert.sameValue('${index}'.replace(re, 'test262'), '${index}', '${jsesc(index)} should not match ${jsesc(reStr)}');`),
    ];

    return content.join('\n');
}

function writeFile(desc, content, suffix = '') {
    const filename = `output/ranges-${slugify(filenamify(desc.toLowerCase()))}${suffix}.js`;
    fs.writeFileSync(filename, content);
}

function checkRanges(max, pattern, flags, cb) {
    const rewritten = rewritePattern(pattern, flags);
    console.log(rewritten, pattern, flags);
    console.log('------');
    const ranges = new RegExp(rewritePattern(pattern, flags), flags);

    for (let i = 0; i <= max; i++) {
        let sequence = jsesc(i, { numbers: 'hexadecimal' }).replace('0x', '');

        while (sequence.length < 4) {
            sequence = `0${sequence}`;
        }

        sequence = `\\u${sequence}`;

        const test = String.fromCodePoint(i).match(ranges);
        cb(test, sequence);
    }
}

// No additions
for (const [desc, escape] of Object.entries(patterns)) {
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
    ].forEach(({quantifier, flags, suffix, posCb = u => [u], negCb = u => [u]}) => {
        const pattern = `${escape}${quantifier}`;
        const reStr = `/${pattern}/${flags}`;

        const positives = [];
        const negatives = [];

        checkRanges(0xFFFF, pattern, flags, (test, unicode) => {
            if (test) {
                positives.push(...posCb(unicode));
            } else {
                negatives.push(...negCb(unicode));
            }
        });

        const content = buildContent(desc, reStr, positives, negatives);

        writeFile(desc, content, suffix);
    });
}
