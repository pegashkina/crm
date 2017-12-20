const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

Schema.pre('update', function (next) {
    const user = this;

    bcrypt.genSalt(10, (error, salt) => {
        if (error) return next(error);
        console.log(user)
        bcrypt.hash(user._update.$set.password, salt, (error, hash) => {
            if (error) return next(error);
            user._update.$set.password = hash;
            next();
        });
    });
});

Schema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, (error, salt) => {
            if (error) return next(error);
            bcrypt.hash(user.password, salt, (error, hash) => {
                if (error) return next(error);
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

Schema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (error, matches) => {
        if (error) return callback(error);
        callback(null, matches);
    });
};

mongoose.model('User', Schema);