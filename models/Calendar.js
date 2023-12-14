// calendarModel.js

const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:true,
    },
    date: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Calendar = mongoose.model('Calendar', calendarSchema);
module.exports = Calendar;
