const mongoose = require('mongoose');

const api = {};
api.getContact = (Contact, AugustToken) => (req, res) => {
    if (AugustToken) {
        if (req.query.id) {
            Contact.findOne({_id: req.query.id}, (error, users) => {
                if (error) throw error;
                res.status(200).json(users);
            });
        } else {
            Contact.find({}, (error, users) => {
                if (error) throw error;
                res.status(200).json(users);
            });
        }

    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}

api.addContact = (Contact, AugustToken) => (req, res) => {
    if (AugustToken) {
        const newContact = new Contact({
            manager: req.user._id,
            name: req.body.name,
            tel: req.body.tel,
            email: req.body.email,
            comment: req.body.comment,
            city: req.body.city
        });
        newContact.save((error) => {
            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            res.json({ success: true, message: 'Контакт успешно сохранен' });
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}

api.editContact = (Contact, AugustToken) => (req, res) => {
    if (AugustToken) {
        Contact.update({ _id: req.query.id }, {
            manager: req.user._id,
            name: req.body.name,
            tel: req.body.tel,
            email: req.body.email,
            comment: req.body.comment,
            city: req.body.city,
            dateEdit: Date.now()
        },(error) => {
            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            res.json({ success: true, message: 'Контакт успешно сохранен' });
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}

api.removeContact = (Contact, AugustToken) => (req, res) => {
    if (AugustToken) {
        Contact.remove({ _id: {$in: req.body.ids}}, (error) => {
            if (error) return res.status(400).json({ success: false, message:  'Некоторые поля не были заполнены' });
            res.json({ success: true, message: 'Контакты успешно удалены' });
        })
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}
module.exports = api;