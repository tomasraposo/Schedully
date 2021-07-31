const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require(process.cwd()+'/models/User');

const opts = {
	secretOrKey: process.env.TOKEN_SECRET,
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
	// jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("jwt")
	// jwtFromRequest: ExtractJWT.fromUrlQueryParameter("token")
}

passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
	User.findById(jwt_payload.id).then(user => {
		return done(null, user);
	}).catch(err => {
		return done(err);
		});
	}
))
