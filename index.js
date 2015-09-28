var schedule = require('node-schedule');
var eibd = require('eibd');
var moment = require('moment');
var currentJob;

/**
 * Get the current time in the form [dayOfTheWeek, hour, minutes, seconds]
 */
var getCurrentTime = function () {
    var time = [];
    var mom =  moment();
    time[0] = mom.isoWeekday();
    time[1] = mom.hour();
    time[2] = mom.minute();
    time[3] = mom.seconds();
    return time;
};

/**
 * Get the current date in the form [day, month, year]
 */
var getCurrentDate = function () {
    // For the date the value must be:
    var date = [];
    var mom =  moment();
    date[0] = mom.date();
    date[1] = mom.month() + 1; // for moment, january it's 0.
    date[2] = Number(mom.year().toString().substr(2,3));
    return date;
};


var createScheduledJob = function (opts, addresses, cronStr, genTime, genDate, callback) {

    var gads = addresses.map(function(gad) {
        return eibd.str2addr(gad);
    });

    var conn = eibd.Connection();

    schedule.scheduleJob(cronStr, function(err) {
        if (err) {
            return callback(err);
        }

        conn.socketRemote(opts, function(err) {
            if (err) {
                return callback(err);
            }
            gads.forEach(function(gad) {
                conn.openTGroup(gad, 1, function (err) {
                    if(err) {
                        callback(err);
                    } else {
                        var msg, time, date;
                        if (genTime) {
                            time = getCurrentTime();
                            msg = eibd.createMessage('write', 'DPT10', time);
                            conn.sendAPDU(msg, callback);
                        }
                        if (genDate) {
                            date = getCurrentDate();
                            msg = eibd.createMessage('write', 'DPT11', date);
                            conn.sendAPDU(msg, callback);
                        }
                    }
                });
            });
        });
    });
};

/**
 * var opts = { host: host, port: port};
 * addresses = [gads]
 * cronStr = cron schedule string
 * genTime = if true, generate the time datagram
 * genDate = if true, generate the date datagram
 */
var startDateTimeJob = function (opts, addresses, cronStr, genTime, genDate, callback) {
    if (currentJob) {
        currentJob.cancel();
    }
    currentJob = createScheduledJob(opts, addresses, cronStr, genTime, genDate, callback);
};


module.exports = {
    startDateTimeJob: startDateTimeJob
};
