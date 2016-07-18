const {test, assert, spy} = require('scar');
const {el} = require('../src/lolight');

const withDoc = fn => {
    const doc = {
        createElement: spy(call => ({elidx: call.idx}))
    };

    const docBak = global.document;
    global.document = doc;
    fn();
    if (docBak) {
        global.document = docBak;
    } else {
        delete global.document; // eslint-disable-line prefer-reflect
    }
};


test('lolight.el is function', () => {
    assert.equal(typeof el, 'function');
});

test('lolight.el() throws if no global document', () => {
    assert.throws(() => {
        el();
    }, /no doc/);
});

test('lolight.el() throws if no element', () => {
    withDoc(() => {
        assert.throws(() => {el();});
    });
});

test('lolight.el({}) throws if no element', () => {
    withDoc(() => {
        assert.throws(() => {el({});});
    });
});

test('lolight.el(element) works - textContent \'some text\'', () => {
    const stubEl = {
        textContent: 'some text',
        innerHtml: 'xyz',
        appendChild: spy()
    };
    withDoc(() => {
        el(stubEl);
        assert.equal(stubEl.innerHTML, '');
        assert.deepEqual(stubEl.appendChild.calls.map(call => call.args), [
            [{elidx: 0, className: 'll-nam', textContent: 'some'}],
            [{elidx: 1, className: 'll-spc', textContent: ' '}],
            [{elidx: 2, className: 'll-nam', textContent: 'text'}]
        ]);
        assert.deepEqual(global.document.createElement.calls.map(call => call.args), [
            ['span'],
            ['span'],
            ['span']
        ]);
    });
});

test('lolight.el(element) works - textContent \' \'', () => {
    const stubEl = {
        textContent: ' ',
        innerHtml: 'xyz',
        appendChild: spy()
    };
    withDoc(() => {
        el(stubEl);
        assert.equal(stubEl.innerHTML, '');
        assert.deepEqual(stubEl.appendChild.calls.map(call => call.args), [
            [{elidx: 0, className: 'll-spc', textContent: ' '}]
        ]);
        assert.deepEqual(global.document.createElement.calls.map(call => call.args), [
            ['span']
        ]);
    });
});

test('lolight.el(element) works - textContent \'\'', () => {
    const stubEl = {
        textContent: '',
        innerHtml: 'xyz',
        appendChild: spy()
    };
    withDoc(() => {
        el(stubEl);
        assert.equal(stubEl.innerHTML, '');
        assert.deepEqual(stubEl.appendChild.calls.map(call => call.args), []);
        assert.deepEqual(global.document.createElement.calls.map(call => call.args), []);
    });
});
