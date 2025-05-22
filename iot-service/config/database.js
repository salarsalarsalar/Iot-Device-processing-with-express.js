const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv);
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://mongo:27017/iot_db', {            
            maxPoolSize: 5,
            minPoolSize: 0,
            connectTimeoutMS: 30000,
        });
        console.log('IoT Database connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the IoT database:', err);
        process.exit(1);
    }
};

module.exports = connectDB;