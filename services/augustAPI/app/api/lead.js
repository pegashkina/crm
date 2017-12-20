const mongoose = require('mongoose');

const api = {};

api.getLead = (Lead, AugustToken) => (req, res) => {
    if (AugustToken) {
        if (req.query.id) {
            Lead.findOne({_id: req.query.id}, (error, users) => {
                if (error) throw error;
                res.status(200).json(users);
            });
        } else {
            Lead.find({}, (error, users) => {
                if (error) throw error;
                res.status(200).json(users);
            });
        }

    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};

api.addLead = (Lead, AugustToken) => (req, res) => {
    if (AugustToken) {
        const newLead = new Lead({
            manager: req.user._id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            comment: req.body.comment,
            contactsId: req.body.contactsId
        });
        console.log(newLead);
        newLead.save((error) => {
            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            res.json({ success: true, message: 'Сделка успешно сохранена' });
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};

api.editLead = (Lead, AugustToken) => (req, res) => {

    if (AugustToken) {
        Lead.update({ _id: req.query.id }, {
            manager: req.user._id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            comment: req.body.comment,
            contactsId: req.body.contactsId,
            dateEdit: Date.now()
        },(error) => {
            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            res.json({ success: true, message: 'Сделка успешно отредактирована' });
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};

api.removeLead = (Lead, AugustToken) => (req, res) => {
    if (AugustToken) {
        Lead.remove({ _id: {$in: req.body.ids}}, (error) => {
            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            res.json({ success: true, message: 'Сделки успешно удалены' });
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
};

module.exports = api;