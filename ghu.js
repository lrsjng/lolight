const {resolve, join} = require('path');
const {ghu, each, jszip, mapfn, read, remove, uglify, watch, wrap, write} = require('ghu');

const NAME = 'lolight';

const ROOT = resolve(__dirname);
const SRC = join(ROOT, 'src');
const BUILD = join(ROOT, 'build');
const TEST = join(ROOT, 'test');
const DIST = join(ROOT, 'dist');

ghu.defaults('release');

ghu.before(runtime => {
    runtime.pkg = Object.assign({}, require('./package.json'));
    runtime.comment = `${runtime.pkg.name} v${runtime.pkg.version} - ${runtime.pkg.homepage}`;
    runtime.comment_js = `/*! ${runtime.comment} */\n`;
    runtime.comment_html = `<!-- ${runtime.comment} -->`;
    console.log(runtime.comment);
});

ghu.task('clean', 'delete build folder', () => {
    return remove(`${BUILD}, ${DIST}`);
});

ghu.task('build:scripts', runtime => {
    return read(`${SRC}/${NAME}.js`)
        .then(wrap(runtime.comment_js))
        .then(write(`${DIST}/${NAME}.js`, {overwrite: true}))
        .then(write(`${BUILD}/${NAME}-${runtime.pkg.version}.js`, {overwrite: true}))
        .then(uglify())
        .then(wrap(runtime.comment_js))
        .then(write(`${DIST}/${NAME}.min.js`, {overwrite: true}))
        .then(write(`${BUILD}/${NAME}-${runtime.pkg.version}.min.js`, {overwrite: true}));
});

ghu.task('build:copy', () => {
    return read(`${ROOT}/*.md`)
        .then(write(mapfn.p(ROOT, BUILD), {overwrite: true}));
});

ghu.task('build:demo', runtime => {
    return read(`${SRC}/demo.html`)
        .then(each(obj => {
            obj.content = obj.content
                .replace(/lolight demo/g, `${NAME} v${runtime.pkg.version} demo`)
                .replace(/"lolight\.js"/g, `"${NAME}-${runtime.pkg.version}.min.js"`);
        }))
        .then(wrap('', runtime.comment_html))
        .then(write(`${BUILD}/demo.html`, {overwrite: true}));
});

ghu.task('build', ['build:scripts', 'build:copy', 'build:demo']);

ghu.task('zip', ['build'], runtime => {
    return read(`${BUILD}/**/*`)
        .then(jszip({dir: BUILD, level: 9}))
        .then(write(`${BUILD}/${NAME}-${runtime.pkg.version}.zip`, {overwrite: true}));
});

ghu.task('release', ['clean', 'zip']);

ghu.task('watch', ['clean', 'build'], runtime => {
    return watch([SRC, TEST], () => ghu.run(['build'], runtime.args, true));
});
