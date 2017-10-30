var passport = require('passport'),
    bcrypt = require('bcryptjs'),
    LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.userId);
});

passport.deserializeUser(function (userId, done) {
    User.findOne({userId: userId}, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'phone',
        passwordField: 'password'
    },
    function (phone, password, done) {
        User.findOne({phone: phone}, function (err, user) {
            if (err == null && user && user.status == 0) {
                bcrypt.compare(password, user.password, function (err, res) {
                    if (err == null && res) {
                        return done(null, user, null);
                    } else {
                        return done(212, false, null);
                    }
                });
            } else if (!user) {
                return done(211, false, null);
            } else if (user.status != 0) {
                return done(210, false, null);
            } else {
                return done(err);
            }
        });
    }
));