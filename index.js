#!/usr/bin/env node
const { generateRecordCommitment } = require("./clients/commands/record.js");
const { evaluateAgreement } = require("./clients/commands/evaluate.js");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { utils } = require("./clients/utils/util.js");

const argv = yargs(hideBin(process.argv))
    .scriptName("zk-agreement")
    .usage('$0 <cmd> [args]')
    .command('commit [userA] [userB] [secret] [value]', 'generate the commitment of the signed records', (yargs) => {
        return yargs
            .positional('userA', {
                describe: 'User A',
                type: 'string'
            })
            .positional('userB', {
                describe: 'User B',
                type: 'string'
            })
            .positional('value', {
                describe: 'the agreed secret between A and B',
                type: 'string',
                default: '0.1'
            })
            .positional('record', {
                describe: 'the signed agreement records between buyer and seller',
                type: 'string'
            });
    }, (argv) => generateRecordCommitment(argv.userA, argv.userB, argv.value, argv.record))
    .command('evaluate [in] [evaluator] [ratio]', 'Evaluate the agreed commitment', (yargs) => {
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
            .positional('ratio', {
                describe: 'the commitment of the agreed statement, 1 means true, 0 means false',
                type: 'number',
                default: 1
            });
    }, (argv) => evaluateAgreement(argv.in, argv.evaluator, argv.ratio))
    .help()
    .alias('help', 'h')
    .argv;
