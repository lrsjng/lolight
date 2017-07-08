const {test, assert, insp: inspOrg} = require('scar');
const {tok} = require('../src/lolight');

const insp = x => inspOrg(x).replace('\n', '¶');


test('lolight.tok is function', () => {
    assert.equal(typeof tok, 'function');
});


// pct
'.,:;?!&@~+-*/=<>|()[]{}\\'.split('').forEach(text => {
    test(`lolight.tok(): pct ${insp(text)}`, () => {
        assert.deepEqual(tok(text), [['pct', text]]);
    });
});


// key
`
abstract alias and arguments array as asm assert auto
base begin bool boolean break byte
case catch char checked class clone compl const continue
debugger decimal declare def default defer deinit del delegate delete do double
echo elif elsif else elseif end ensure enum event except exec explicit export extends extension extern
fallthrough false final finally fixed float for foreach friend from func function
global goto guard
if implements implicit import in init include include_once inline inout instanceof int interface internal is
lambda let lock long
module mutable
NaN namespace native next new nil not null
object operator or out override
package params private protected protocol public
raise readonly redo ref register repeat require require_once rescue restrict retry return
sbyte sealed self short signed sizeof static string struct subscript super synchronized switch
template then this throw throws transient true try typealias typedef typeid typename typeof
unchecked undef undefined union unless unsigned until use using
var virtual void volatile
wchar_t when where while with
xor
yield
`.split(/\s+/).filter(x => x).forEach(text => {
        test(`lolight.tok(): key ${insp(text)}`, () => {
            assert.deepEqual(tok(text), [['key', text]]);
        });
    });


// nam
[
    'a',
    '_',
    '_a',
    'a_',
    '$',
    '$a',
    'a$'
].forEach(text => {
    test(`lolight.tok(): nam ${insp(text)}`, () => {
        assert.deepEqual(tok(text), [['nam', text]]);
    });
});


// num
[
    '0',
    '1',
    '01',
    '1234567890',
    '+1',
    '-1',
    '1.2',
    '.1',
    '1e2',
    '+.12e+3',
    '+.12E+3',
    '#abc',
    '#abcabc'
].forEach(text => {
    test(`lolight.tok(): num ${insp(text)}`, () => {
        assert.deepEqual(tok(text), [['num', text]]);
    });
});


// str
[
    '"a"',
    '"äáàß€"',
    '"1"',
    '"_"',
    '" "',
    '"   "',
    '"\'"',
    "'a'",
    "'äáàß€'",
    "'1'",
    "'_'",
    "' '",
    "'   '",
    "'\"'"
].forEach(text => {
    test(`lolight.tok(): str ${insp(text)}`, () => {
        assert.deepEqual(tok(text), [['str', text]]);
    });
});


// misc
[
    ['', []],
    ['ä', [['unk', 'ä']]],
    ['á', [['unk', 'á']]],
    ['à', [['unk', 'à']]],
    ['ß', [['unk', 'ß']]],
    ['€', [['unk', '€']]],

    // whitespace
    [' ', [['spc', ' ']]],
    ['  ', [['spc', '  ']]],
    [' \t ', [['spc', ' \t ']]],
    ['\n', [['spc', '\n']]],
    [' \n ', [['spc', ' \n ']]],

    ['func a', [['key', 'func'], ['spc', ' '], ['nam', 'a']]],
    ['()', [['pct', '('], ['pct', ')']]],

    // comment
    ['//', [['com', '//']]],
    ['/**/', [['com', '/**/']]],
    ['/*/', [['rex', '/*/']]], // !!! no comment
    ['#', [['com', '#']]],
    ['#ab', [['com', '#ab']]],
    ['#abc', [['num', '#abc']]], // !!! no comment
    ['#abcd', [['com', '#abcd']]],
    ['#abcde', [['com', '#abcde']]],
    ['#abcdef', [['num', '#abcdef']]], // !!! no comment
    ['#abcdex', [['com', '#abcdex']]],
    ['# abc', [['com', '# abc']]],
    ['# abcdef', [['com', '# abcdef']]],
    ['a// comment\nb', [['nam', 'a'], ['com', '// comment'], ['spc', '\n'], ['nam', 'b']]],
    ['a/* comment\n*/b', [['nam', 'a'], ['com', '/* comment\n*/'], ['nam', 'b']]],
    ['a# comment\nb', [['nam', 'a'], ['com', '# comment'], ['spc', '\n'], ['nam', 'b']]],

    // div
    ['a/b', [['nam', 'a'], ['pct', '/'], ['nam', 'b']]],
    ['a/b/', [['nam', 'a'], ['pct', '/'], ['nam', 'b'], ['pct', '/']]],
    ['a /b/', [['nam', 'a'], ['spc', ' '], ['pct', '/'], ['nam', 'b'], ['pct', '/']]],
    ['1/b/', [['num', '1'], ['pct', '/'], ['nam', 'b'], ['pct', '/']]],
    ['1 /b/', [['num', '1'], ['spc', ' '], ['pct', '/'], ['nam', 'b'], ['pct', '/']]],
    ['a/b/c', [['nam', 'a'], ['pct', '/'], ['nam', 'b'], ['pct', '/'], ['nam', 'c']]],
    ['a /b/ c', [['nam', 'a'], ['spc', ' '], ['pct', '/'], ['nam', 'b'], ['pct', '/'], ['spc', ' '], ['nam', 'c']]],

    // regexp
    ['+/b/', [['pct', '+'], ['rex', '/b/']]],
    ['+ /b/', [['pct', '+'], ['spc', ' '], ['rex', '/b/']]],
    ['/b/', [['rex', '/b/']]],
    [' /b/', [['spc', ' '], ['rex', '/b/']]],
    ['/*/', [['rex', '/*/']]],
    ['a=/b/', [['nam', 'a'], ['pct', '='], ['rex', '/b/']]],
    ['a=/b/c', [['nam', 'a'], ['pct', '='], ['rex', '/b/'], ['nam', 'c']]],
    ['a = /b/ c', [['nam', 'a'], ['spc', ' '], ['pct', '='], ['spc', ' '], ['rex', '/b/'], ['spc', ' '], ['nam', 'c']]],
    ['a\n/b/c', [['nam', 'a'], ['spc', '\n'], ['rex', '/b/'], ['nam', 'c']]]
].forEach(([text, exp]) => {
    test(`lolight.tok(${insp(text)}) works`, () => {
        assert.deepEqual(tok(text), exp);
    });
});


// throws
[
    undefined,
    null,
    0,
    1,
    /a/,
    true,
    false,
    [],
    {}
].forEach(text => {
    test(`lolight.tok(${insp(text)}) throws`, () => {
        assert.throws(() => tok(text), /tok.+string/);
    });
});
