const mongoose = require('mongoose');
const api = {};

api.getUser = (User, Manager, AugustToken) => (req, res) => {
    const token = AugustToken;
    if (token) {
        if (req.query.id) {
            Manager.findOne({user_id: req.query.id}, (error, user) => {
                if (error) throw error;
                if (!user) res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
                else {
                    res.status(200).json(user);
                }
            });
        }else{
            Manager.find({}, (error, users) => {
                if (error) throw error;
                res.status(200).json(users);
                
            });
        }
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}

api.addUser = (User, Manager, AugustToken) => (req, res) => {
    if (AugustToken) {
        if (!req.body.username || !req.body.password) res.json({ success: false, message: 'Please, pass a username and password.' });
        else {
            const newUser = {
                username: req.body.username,
                password: req.body.password
            };
            User.create(newUser, function (err, small) {
                if (err) return res.status(400).json({ success: false, message:  'Username already exists.' });

                const newManager = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    tel: req.body.tel,
                    email: req.body.email,
                    isAdmin: req.body.isAdmin,
                    user_id: small._id
                }
                Manager.create(newManager, function (err) {
                    if (err) return handleError(err);

                    res.json({success: true, message: 'Account created successfully'});
                })
            })
        }
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}
module.exports = api;