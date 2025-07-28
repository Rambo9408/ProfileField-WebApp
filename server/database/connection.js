require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connected: ${con.connection.name}`);
    } catch (err) {
        console.error(err);
        process.exit(1);// used for exit when failure
    }
};

module.exports = connectDB;