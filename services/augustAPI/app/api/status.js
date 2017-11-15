const mongoose = require('mongoose');

const api = {};

api.getStatus = (Status, AugustToken) => (req, res) => {
    if (AugustToken) {
        if (req.query.id) {
            Status.findOne({_id: req.query.id}, (error, users) => {
                if (error) throw error;
                res.status(200).json(users);
            });
        } else {
            Status.find({}, (error, users) => {
                if (error) throw error;
                res.status(200).json(users);
            });
        }
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};

api.addStatus = (Status, AugustToken) => (req, res) => {
    if (AugustToken) {
        const newLead = new Status({
            order: req.body.order,
            title: req.body.title,
            color: req.body.color
        });
        newLead.save((error) => {
            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            res.json({ success: true, message: 'Сделка успешно сохранена' });
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};

api.editStatus = (Status, AugustToken) => (req, res) => {
    if (AugustToken) {
        Status.update({ _id: req.query.id }, {
            order: req.body.order,
            title: req.body.title,
            color: req.body.color
        },(error) => {
            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            res.json({ success: true, message: 'Сделка успешно отредактирована' });
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};

api.removeStatus = (Status, AugustToken) => (req, res) => {
    if (AugustToken) {
        Status.remove({ _id: {$in: req.body.ids}}, (error) => {
            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            res.json({ success: true, message: 'Сделки успешно удалены' });
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};

module.exports = api;