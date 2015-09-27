var schedule = require('node-schedule');
var eibd = require('eibd');
var moment = require('moment');
var timeJob, dateJob;

var createScheduledJob = function (opts, addresses, cronStr, dptType, value, callback) {
    schedule.scheduleJob(cronStr, function() {
        var conn = eibd.Connection();
        conn.socketRemote(opts, function() {
            conn.openTGroup(address, 1, function (err) {
                if(err) {
                    callback(err);
                } else {
                    var msg = eibd.createMessage('write', 'DPT10', parseInt(value));
                    conn.sendAPDU(msg, callback);
                }
            });
        });
    });
};

var startTime = function (opts, addresses, cronStr, callback) {
    if (timeJob) {
        timeJob.cancel();
    }
    // For the time the value must be: [dayOfTheWeek, hour, minutes, seconds]
    var time = [];
    var mom =  moment();
    time[0] = mom.isoWeekday();
    time[1] = mom.hour();
    time[2] = mom.minute();
    time[3] = mom.seconds();
    timeJob = createTimeJob(opts, addresses, cronStr, 'DPT10',callback);
};

var startDate = function (opts, addresses, cronStr, callback) {
    if (dateJob) {
        dateJob.cancel();
    }
    // For the date the value must be:  [day, month, year]
    var time = [];
    var mom =  moment();
    time[0] = mom.month() + 1; // for moment, january it's 0.
    time[1] = mom.year();
    dateJob = createScheduledJob(opts, addresses, cronStr, 'DPT11',callback);
};

module.exports = {
    startTime: startTime,
    startDate: startDate
};
