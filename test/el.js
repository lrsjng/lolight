const {test, assert} = require('scar');
const {el} = require('../src/lolight');

test('lolight.el is function', () => {
    assert.equal(typeof el, 'function');
});
