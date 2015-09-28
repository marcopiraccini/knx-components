knx-components
===============

KNX Software Components. For now it emits the time (DPT-10) and date (DPT-11)
using cron-style configuration.
See <a href="https://github.com/tejasmanohar/node-schedule/wiki/Cron-style-Scheduling">Here</a>
on how to write the cron string.

To use it, just:

`npm i knx-components --save
`
Then in your code:

```
var cronDate = "0 0 * * *"; // Every day (at midnight)
var addresses = ['0/0/143', '0/0/144'];
var opts = { host: '192.168.69.150', port: 6720};
require("knx-components").startDateTimeJob(opts, addresses, cronDate, genTime, genDate, function (err) {
    console.log('An error has occurred', err);
});
```

Subsequent calls of startDateTimeJob will substitute the previous schedule with the new one.

CLI (-t: generate time, -d: generate date):
`knxdtgen -H 192.168.69.150 -p 6720 -g 0/0/143 -td`
