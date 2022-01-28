require('dotenv').config()
const mongoose = require('mongoose')

const mongoURL = process.env.DB_URL

const connectDB = async () => {
    try {
        mongoose.connect(mongoURL)
    }catch (err){
        console.log(err);
        process.exit(1)
    }
}

module.exports = connectDB;