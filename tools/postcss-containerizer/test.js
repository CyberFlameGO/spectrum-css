const fs = require('fs');
const test = require('ava');
const postcss = require('postcss');
const plugin = require('./index.js');

function compare(t, fixtureFilePath, expectedFilePath, options = {}){
  return postcss([ plugin(options) ])
    .process(
      readFile(`./fixtures/${fixtureFilePath}`),
      { from: fixtureFilePath }
    )
    .then(result => {
      const actual = result.css;
      const expected = readFile(`./expected/${expectedFilePath}`);
      t.is(actual, expected);
      t.is(result.warnings().length, 0);
    });
}

function readFile(filename) {
  return fs.readFileSync(filename, 'utf8');
}

test('create basic output for 2 systems', t => {
  return compare(t, 'basic.css', 'basic.css');
});

test('create output for 3 systems', t => {
  return compare(t, 'multisystem.css', 'multisystem.css');
});

test('work when system container queries appear more than once', t => {
  return compare(t, 'duplicatesystem.css', 'basic.css');
});
