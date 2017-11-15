const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    tel: {type: String},
    email: {type: String},
    isAdmin: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Manager', Schema);