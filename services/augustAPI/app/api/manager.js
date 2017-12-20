const mongoose = require('mongoose');
const api = {};

api.editUser = (User, Manager, AugustToken) => (req, res) => {

    if (AugustToken) {

        var upd2 =  {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            tel: req.body.tel,
            email: req.body.email
        }
        var upd = (req.body.password) ? {
                username: req.body.username,
                password: req.body.password
            } : {
                username: req.body.username
            }
        Manager.findByIdAndUpdate(req.query.id, upd2,(error, datas) => {

            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            User.update({ _id: datas.user_id }, upd,(error) => {
                console.log(error);
                if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
                res.json({ success: true, message: 'Пользователь успешно отредактирован' });
            })
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};

api.removeUser = (User, Manager, AugustToken) => (req, res) => {
    if (AugustToken) {
        Manager.find({ _id: {$in: req.body.ids}}, (error, users) => {
            if (error) throw error;
            let ids = []
            users.forEach(el => {
                ids.push(el.user_id);
            })
            console.log(ids);
            Manager.remove({ _id: {$in: req.body.ids}}, (error) => {
                if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });

                User.remove({ _id: {$in: ids}}, (error) => {
                    if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
                    res.json({ success: true, message: 'Пользователи успешно удалены' });
                })
            })
        });

    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};


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
                let ids = []
                users.forEach(el => {
                    ids.push(el.user_id);
                })

                User.find({ _id: {$in: ids}}, function(error, data){

                    var nw = [];
                    users.forEach((el, key) => {
                        var nm = '';
                        data.forEach((el2, key2) => {
                            if (toString(el.user_id) === toString(el2._id)) {
                                nm = el2.username;
                            }
                        });
                        nw.push({
                            _id: el._id,
                            firstName: el.firstName,
                            lastName: el.lastName,
                            user_id: el.user_id,
                            email: el.email,
                            tel: el.tel,
                            isAdmin: el.isAdmin,
                            username: nm
                        });
                    })

                    res.status(200).json(nw);
                });


                
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