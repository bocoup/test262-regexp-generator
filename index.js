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
        `var re = ${reStr};

// Positive Values
var positives = ["${positives.join('", "')}"];

// Negative Values
var negatives = ["${negatives.join('", "')}"];

positives.forEach(function(index) {
    assert.sameValue(index.replace(re, 'test262'), 'test262', 'char should match ${jsesc(reStr)}');
});

positives.forEach(function(index) {
    assert.sameValue(index.replace(re, 'test262'), 'test262', 'char should match ${jsesc(reStr)}');
});
`,
    ];

    return content.join('\n');
}

// No additions
for (const [desc, escape] of Object.entries(patterns)) {
    const rewritten = rewritePattern(escape);
    const ranges = new RegExp(rewritten);

    let positives = [];
    let negatives = [];

    for (let i = 0; i <= 0xFFFF; i++) {
        const index = jsesc(i, { numbers: 'hexadecimal' }).replace('0x', '\\u');
        if (ranges.test(String.fromCodePoint(i))) {
            positives.push(index);
        } else {
            negatives.push(index);
        }
    }

    const filename = `output/ranges-${slugify(filenamify(desc.toLowerCase()))}.js`;
    const reStr = `/${escape}/`;
    const content = buildContent(desc, reStr, positives, negatives);
    fs.writeFileSync(filename, content);
}

// Using + escape
for (const [desc, escape] of Object.entries(patterns)) {
    const rewritten = rewritePattern(escape + '+');
    const ranges = new RegExp(rewritten);

    let positives = [];
    let negatives = [];

    for (let i = 0; i <= 0xFFFF; i++) {
        // const index = jsesc(i, { numbers: 'hexadecimal' });
        const index = jsesc(i, { numbers: 'hexadecimal' }).replace('0x', '\\u');
        if (ranges.test(String.fromCodePoint(i))) {
            positives.push(index);
            positives.push(index + index);
        } else {
            negatives.push(index);
        }
    }

    const filename = `output/ranges-${slugify(filenamify(desc.toLowerCase()))}-plus-quantifier.js`;
    const reStr = `/${escape}+/`;
    const content = buildContent(desc, reStr, positives, negatives);
    fs.writeFileSync(filename, content);
}
