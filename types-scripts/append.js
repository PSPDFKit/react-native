const fs = require('fs');

const typesPath = './types/index.d.ts';
const typesData = fs.readFileSync(typesPath);

const appendPath = './types-scripts/native-modules.ts';
const appendData = fs.readFileSync(appendPath);

fs.writeFileSync(typesPath, typesData + '\n\n' + appendData);