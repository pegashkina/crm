const passport = require('passport'),
    config = require('@config'),
    models = require('@augustCRM/app/setup');
module.exports = (app) => {
    const api = app.augustAPI.app.api.status;
    app.route('/api/v1/status/get')
        .get(passport.authenticate('jwt', config.session), api.getStatus(models.Status, app.get('augustsecret')));
    app.route('/api/v1/status/add')
        .post(passport.authenticate('jwt', config.session), api.addStatus(models.Status, app.get('augustsecret')));
    app.route('/api/v1/status/remove')
        .post(passport.authenticate('jwt', config.session), api.removeStatus(models.Status, app.get('augustsecret')));
    app.route('/api/v1/status/edit')
        .post(passport.authenticate('jwt', config.session), api.editStatus(models.Status, app.get('augustsecret')));
}