const {test, assert, spy} = require('scar');
const {el} = require('../src/lolight');

const with_doc = fn => {
    const doc = {
        createElement: spy(call => ({elidx: call.idx}))
    };

    const doc_bak = global.document;
    global.document = doc;
    fn();
    if (doc_bak) {
        global.document = doc_bak;
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
    with_doc(() => {
        assert.throws(() => {el();});
    });
});

test('lolight.el({}) throws if no element', () => {
    with_doc(() => {
        assert.throws(() => {el({});});
    });
});

test('lolight.el(element) works - textContent \'some text\'', () => {
    const stub_el = {
        textContent: 'some text',
        innerHtml: 'xyz',
        appendChild: spy()
    };
    with_doc(() => {
        el(stub_el);
        assert.equal(stub_el.innerHTML, '');
        assert.deepEqual(stub_el.appendChild.calls.map(call => call.args), [
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
    const stub_el = {
        textContent: ' ',
        innerHtml: 'xyz',
        appendChild: spy()
    };
    with_doc(() => {
        el(stub_el);
        assert.equal(stub_el.innerHTML, '');
        assert.deepEqual(stub_el.appendChild.calls.map(call => call.args), [
            [{elidx: 0, className: 'll-spc', textContent: ' '}]
        ]);
        assert.deepEqual(global.document.createElement.calls.map(call => call.args), [
            ['span']
        ]);
    });
});

test('lolight.el(element) works - textContent \'\'', () => {
    const stub_el = {
        textContent: '',
        innerHtml: 'xyz',
        appendChild: spy()
    };
    with_doc(() => {
        el(stub_el);
        assert.equal(stub_el.innerHTML, '');
        assert.deepEqual(stub_el.appendChild.calls.map(call => call.args), []);
        assert.deepEqual(global.document.createElement.calls.map(call => call.args), []);
    });
});
