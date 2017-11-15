const PassportJWT = require('passport-jwt'),
    ExtractJWT = PassportJWT.ExtractJwt,
    Strategy = PassportJWT.Strategy,
    config = require('./index.js'),
    models = require('@augustCRM/app/setup');

module.exports = (passport) => {
    const User = models.User;

    const parameters = {
        secretOrKey: config.secret,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    };

    passport.use(new Strategy(parameters, (payload, done) => {
        User.findOne({ _id: payload.user._id }, (error, user) => {
            if (error) return done(error, false);
            if (user) done(null, user);
            else done(null, false);
        });
    }));
}