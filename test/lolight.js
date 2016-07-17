const {test, assert} = require('scar');
const lolight = require('../src/lolight');

test('lolight is function', () => {
    assert.equal(typeof lolight, 'function');
});
