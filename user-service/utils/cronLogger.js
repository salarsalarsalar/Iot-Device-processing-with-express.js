const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/service-status.log');

function CronLogger(serviceName = 'Unknown Service', interval = '*/5 * * * *') {
  cron.schedule(interval, () => {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ${serviceName} is running\n`;

    fs.appendFile(logFile, message, (err) => {
      if (err) {
        console.error(`[CronLogger] Failed to write log for ${serviceName}:`, err.message);
      } else {
        console.log(`[CronLogger] Logged status for ${serviceName}`);
      }
    });
  });
}

module.exports = CronLogger;
