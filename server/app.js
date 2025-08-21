const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./database/connection');
const routes = require('./routes/panelandfieldroutes');

require('dotenv').config();

const port = process.env.PORT;
const app = new express();
app.use(cors());

connectDB().catch((err) => {
    console.error(err);
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/api', routes);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});