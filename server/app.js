const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT;
const app = new express();
const connectDB = require('./database/connection');
connectDB().catch((err) => {
    console.error(err);
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});