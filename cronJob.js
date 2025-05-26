const cron = require('node-cron');
const { exec } = require('child_process');

// Every Sunday at 12:00 PM
cron.schedule('0 12 * * 0', () => {
  exec('node pushToGithub.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Success:\n${stdout}`);
  });
});

console.log('Cron job scheduled for weekly Git push.');
