const mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('@config');

const api = {};

api.login = (User, Manager) => (req, res) => {
    User.count({}, function(err, c) {
        if (!c) {
            const newUser = {
                username: 'admin',
                password: 'admin'
            };
            User.create(newUser, function (err, small) {
                if (err) return res.status(400).json({ success: false, message:  'Username already exists.' });

                const newManager = {
                    firstName: 'Администратор',
                    lastName: 'Администратор',
                    tel: '',
                    email: '',
                    isAdmin: true,
                    user_id: small._id
                }
                Manager.create(newManager, function (err) {
                    if (err) return handleError(err);
                    User.findOne({ username: req.body.username }, (error, user) => {
                        if (error) throw error;

                        if (!user) res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
                        else {
                            user.comparePassword(req.body.password, (error, matches) => {
                                if (matches && !error) {
                                    const token = jwt.sign({ user }, config.secret);
                                    res.json({ success: true, message: 'Token granted', token, user: user._id });
                                } else {
                                    res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
                                }
                            });
                        }
                    });
                })
            })
        } else {
            User.findOne({ username: req.body.username }, (error, user) => {
                if (error) throw error;

                if (!user) res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
                else {
                    user.comparePassword(req.body.password, (error, matches) => {
                        if (matches && !error) {
                            const token = jwt.sign({ user }, config.secret);
                            res.json({ success: true, message: 'Token granted', token, user: user._id });
                        } else {
                            res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
                        }
                    });
                }
            });
        }
    });
}

api.verify = (headers) => {
    if (headers && headers.authorization) {
        const split = headers.authorization.split(' ');
        if (split.length === 2) return split[1];
        else return null;
    } else return null;
}

module.exports = api;