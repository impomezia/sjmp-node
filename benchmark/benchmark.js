'use strict';

const benchmark  = require('benchmark');
const benchmarks = require('beautify-benchmark');


const suite = new benchmark.Suite();

suite.on('start', e => process.stdout.write('Working...\n\n'));
suite.on('cycle', e => benchmarks.add(e.target));
suite.on('complete', () => benchmarks.log());


module.exports.add = suite.add.bind(suite);
module.exports.run = () => suite.run({ async: false });
