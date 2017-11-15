const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    dateCreate: {
        type: Date,
        default: Date.now
    },
    dateEdit: {
        type: Date,
        default: Date.now
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Manager'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    contactsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager'
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Statuses'
    }
});

mongoose.model('Lead', Schema);