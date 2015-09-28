#!/usr/bin/env node

// example of use: node ./bin/time-gen.js -H 192.168.69.150 -g 0/0/143

var program = require('commander');
var path = require('path');
var pkg = require(path.join(__dirname, '../package.json'));
var me = require('../');

function list(val) {
  return val.split(',');
}

program
    .version(pkg.version)
    .description('Start a time (DPT10) or a date (DPT11) datagram generator to be sent to a KNX group address')
    .usage('[options]')
    .option('-H, --host <host>', 'Host of the knxd / eibd service (defaults to 127.0.0.1)')
    .option('-p, --port <port>', 'Port of the knxd / eibd service (defaults to 6720)', parseInt)
    .option('-g, --addresses <addresses>', 'The list of the group address (comma separated)', list)
    .option('-c, --cron <cron-string>', 'The cron string for scheduling(defaults to "* * * * *")')
    .option('-t, --time', 'Generate time (DPT10) datagrams')
    .option('-d, --date', 'Generate date (DPT11) datagrams')
    .parse(process.argv);

if (!program.addresses) {
    console.log("\nNo group address(es) specified! Use the - g option\n");
    process.exit(1);
}

if ((!program.time) && (!program.date)) {
    console.log("\nSpecify at least one between -t (time) or -d (date)\n");
    process.exit(1);
}

var port = program.port || 6720;
var host = program.host || '127.0.0.1';
var cron = program.cron || '* * * * *';
var addresses = program.addresses;

var opts = { host: host, port: port};

console.log("Generating datagrams for", addresses, "with schedule", cron);
me.startDateTimeJob(opts, addresses, cron, program.time, program.date, function (err, value) {
    if (err) {
        console.log('An error has occurred', err);
        process.exit(1);
    }
});
