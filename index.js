// Dotenv for environment variables
require('dotenv').config();

// File System to write in a text file Slack's logs.
const fs = require('fs');

// Slack Client for Slack API Access
const { WebClient } = require('@slack/client');
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

// Get team access logs and save it to a file
web.team.accessLogs()
    .then((res) => {
        fs.writeFile(process.env.LOGS_PATH, JSON.stringify(res), (err) => {
            if (err) {
                return console.error(err);
            }
            console.log("The log file was saved!");
        });
    })
    .catch(console.error);