const models = require('@augustCRM/app/setup');
module.exports = (app) => {
    const api = app.augustAPI.app.api.auth;
    app.route('/')
        .get((req, res) => res.send('Hello API'));
    app.route('/api/v1/auth')
        .post(api.login(models.User, models.Manager));
}