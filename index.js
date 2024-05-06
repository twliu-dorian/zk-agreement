#!/usr/bin/env node
const { generateAgreementWitness } = require("./clients/commands/agreement.js");
const { evaluateAgreement } = require("./clients/commands/evaluate.js");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

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
    .command('evaluate [in] [result]', 'Evaluate the agreed commitment', (yargs) => {
        return yargs
            .positional('in', {
                describe: 'the commitment of the agreed statement',
                type: 'string',
                default: 'proof.txt'
            })
            .positional('result', {
                describe: 'the commitment of the agreed statement',
                type: 'number',
                default: 1
            });
    }, (argv) => evaluateAgreement(argv.in, argv.result))
    .help()
    .alias('help', 'h')
    .argv;
