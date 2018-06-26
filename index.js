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
};

function buildContent(desc, reStr, positives, negatives) {
    const content = [
        header('prod-CharacterClassEscape', `Compare range (${desc})`),
        `var re = ${reStr};`,
        ...positives.map(index => `assert.sameValue(${index}.replace(re, 'test262'), 'test262', '${jsesc(index)} should match ${jsesc(reStr)}`),
        ...negatives.map(index => `assert.sameValue(${index}.replace(re, 'test262'), 'test262', '${jsesc(index)} should not match ${jsesc(reStr)}`),
    ];

    return content.join('\n');
}

function writeFile(desc, content, suffix = '') {
    const filename = `output/ranges-${slugify(filenamify(desc))}${suffix}.js`;
    fs.writeFileSync(filename, content);
}

function checkRanges(max, pattern, flags = '', cb) {
    const ranges = new RegExp(rewritePattern(pattern), flags);

    for (let i = 0; i <= max; i++) {
        const unicode = jsesc(i, { numbers: 'hexadecimal' }).replace('0x', '\\u');
        const test = ranges.test(String.fromCodePoint(i));
        cb(test, unicode);
    }
}

// No additions
for (const [desc, escape] of Object.entries(patterns)) {
    const reStr = `/${jsesc(escape)}/`;
    const flags = '';

    const positives = [];
    const negatives = [];

    checkRanges(0xFFFF, escape, flags, (test, unicode) => {
        if (test) {
            positives.push(unicode);
        } else {
            negatives.push(unicode);
        }
    });

    const content = buildContent(desc, reStr, positives, negatives);

    writeFile(desc, content);
}

// Using + escape
for (const [desc, escape] of Object.entries(patterns)) {
    escape += '+';
    const reStr = `/${jsesc(escape)}/`;
    const flags = '';

    const positives = [];
    const negatives = [];

    checkRanges(0xFFFF, escape, flags, (test, unicode) => {
        if (test) {
            positives.push(unicode);
            positives.push(unicode + unicode);
        } else {
            negatives.push(unicode);
        }
    });

    const content = buildContent(desc, reStr, positives, negatives);

    writeFile(desc, content, '-plus-quantifier');
}
