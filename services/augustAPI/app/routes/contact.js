const passport = require('passport'),
    config = require('@config'),
    models = require('@augustCRM/app/setup');
module.exports = (app) => {
    const api = app.augustAPI.app.api.contact;
    app.route('/api/v1/contact/get')
        .get(passport.authenticate('jwt', config.session), api.getContact(models.Contact, app.get('augustsecret')));
    app.route('/api/v1/contact/add')
        .post(passport.authenticate('jwt', config.session), api.addContact(models.Contact, app.get('augustsecret')));
    app.route('/api/v1/contact/remove')
        .post(passport.authenticate('jwt', config.session), api.removeContact(models.Contact, app.get('augustsecret')));
    app.route('/api/v1/contact/edit')
        .post(passport.authenticate('jwt', config.session), api.editContact(models.Contact, app.get('augustsecret')));
}