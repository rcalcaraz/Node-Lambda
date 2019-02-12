// Dotenv for environment variables
require('dotenv').config();

// File System to read a file
const fs = require('fs');

// Mongoose to store data in MongoDB
const mongoose = require('mongoose');

// Just a easy config for a Mongoose connection, a Schema and a Model.
mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true });
const slack_logs_schema = mongoose.Schema({ data: JSON });
const slack_logs_model = mongoose.model('slack_logs', slack_logs_schema);

// Watch file and save it when it changes
fs.watchFile(process.env.LOGS_PATH, (curr, prev) => {
    // Read the file and save it in MongoDB as a JSON 
    try{
        let logsFileInfo = fs.readFileSync(process.env.LOGS_PATH, 'utf8');
        let newLogs = new slack_logs_model({
            data: JSON.parse(logsFileInfo)
        });

        // Clean the collection
        slack_logs_model.deleteMany({}, (err) => {
            if (err) {
                console.error("Something were wrong cleaning the collection");
                throw err;
            }
        });
    
        // Save logs info
        newLogs.save((err) => {
            if (err) {
                console.error("Someting were wrong saving the object");
                throw err;
            } else {
                console.log("Logs saved " + curr.atime);
            }
        });

    } catch (err){
        console.error("Maybe file doesn't exist yet...");
    }
});