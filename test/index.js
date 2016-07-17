const {test} = require('scar');

require('./tok');
require('./el');
require('./lolight');

test.cli({sync: true});
