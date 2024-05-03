#!/usr/bin/env node
const { generateAgreementWitness } = require("./clients/commands/agreement.js")
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
            })
    }, generateAgreementWitness)
    .help()
    .alias('help', 'h')
    .argv;