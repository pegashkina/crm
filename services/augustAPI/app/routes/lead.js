const passport = require('passport'),
    config = require('@config'),
    models = require('@augustCRM/app/setup');
module.exports = (app) => {
    const api = app.augustAPI.app.api.lead;
    app.route('/api/v1/lead/get')
        .get(passport.authenticate('jwt', config.session), api.getLead(models.Lead, app.get('augustsecret')));
    app.route('/api/v1/lead/add')
        .post(passport.authenticate('jwt', config.session), api.addLead(models.Lead, app.get('augustsecret')));
    app.route('/api/v1/lead/remove')
        .post(passport.authenticate('jwt', config.session), api.removeLead(models.Lead, app.get('augustsecret')));
    app.route('/api/v1/lead/edit')
        .post(passport.authenticate('jwt', config.session), api.editLead(models.Lead, app.get('augustsecret')));
}