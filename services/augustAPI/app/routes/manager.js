const passport = require('passport'),
    config = require('@config'),
    models = require('@augustCRM/app/setup');
module.exports = (app) => {
    const api = app.augustAPI.app.api.manager;
    app.route('/api/v1/user/get')
        .get(passport.authenticate('jwt', config.session), api.getUser(models.User, models.Manager, app.get('augustsecret')));
    app.route('/api/v1/user/add')
        .post(passport.authenticate('jwt', config.session), api.addUser(models.User, models.Manager, app.get('augustsecret')));
}