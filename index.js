#!/usr/bin/env node
const { generateAgreementWitness } = require("./clients/commands/agreement.js");
const { evaluateAgreement } = require("./clients/commands/evaluate.js");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { utils } = require("./clients/utils/util.js");

const argv = yargs(hideBin(process.argv))
    .scriptName("zk-agreement")
    .usage('$0 <cmd> [args]')
    .command('agree <a> <b>', 'Calculate the agreement witness', (yargs) => {
        return yargs
            .positional('a', {
                describe: 'User A',
                type: 'string'
            })
            .positional('b', {
                describe: 'User B',
                type: 'string'
            });
    }, (argv) => generateAgreementWitness(argv.a, argv.b))
    .command('evaluate [in] [evaluator] [result]', 'Evaluate the agreed commitment', (yargs) => {
        return yargs
            .positional('in', {
                describe: 'the proof element of the agreed statement',
                type: 'string',
                default: 'proof.txt'
            })
            .positional('evaluator', {
                describe: 'the evaluated value of the agreed statement, the default is a random number',
                type: 'number',
                default: utils.generateRandomBitString(256),
            })
            .positional('result', {
                describe: 'the commitment of the agreed statement',
                type: 'number',
                default: 1
            });
    }, (argv) => evaluateAgreement(argv.in, argv.evaluator, argv.result))
    .help()
    .alias('help', 'h')
    .argv;
