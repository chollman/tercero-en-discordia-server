const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const keys = require("../config/keys");

const localOptions = { usernameField: "email" };
passport.use(
    new LocalStrategy(localOptions, (email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false);
                }
                return done(null, user);
            });
        });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            proxy: true,
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ googleId: profile.id }).then((existingUser) => {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    new User({ googleId: profile.id }).save().then((user) => done(null, user));
                }
            });
        }
    )
);

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: keys.secret,
};

passport.use(
    new JwtStrategy(jwtOptions, (payload, done) => {
        User.findById(payload.sub, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    })
);
