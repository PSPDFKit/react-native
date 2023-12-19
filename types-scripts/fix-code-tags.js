const fs = require('fs');
const path = require('path');

const docsDirectory = './jsdoc';

if (!fs.existsSync(docsDirectory)) {
  console.log("No such directory: ", docsDirectory);
  return;
}

const files = fs.readdirSync(docsDirectory);
for (var i = 0; i < files.length; i++) {
  var fileName = path.join(docsDirectory, files[i]);
  if (fileName.endsWith('.html')) {
    console.log(`Found file at ${fileName}, replacing backticks with <code> tags`);
    const fileData = fs.readFileSync(fileName, 'utf8');
    var result = fileData.replace(/```((?!`)[^```]*)```/g,'<code>$1</code>');
    fs.writeFileSync(fileName, result, 'utf8');
  };
}