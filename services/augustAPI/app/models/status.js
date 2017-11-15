const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    order: {
        type: Number
    },
});

mongoose.model('Status', Schema);