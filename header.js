module.exports = (esid = 'pending', description = '', info = '', features) => {
    let header = `// Copyright (C) 2018 Leo Balter.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: ${esid}
description: >
    ${description}
info: |
    This is a generated test
    ${info}
`.trim();

    if (features) {
        header += `\nfeatures: [${features.join(', ')}]`;
    }

    header += `\n---*/\n`;

    return header;
};
