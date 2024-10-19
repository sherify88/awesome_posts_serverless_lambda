import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { User } from '../users/models/user.model';

// Local Strategy for username/password authentication
passport.use(new LocalStrategy({
  usernameField: 'email',  // Use 'email' as the username field
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // If the user is not found, return an error
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If the password is incorrect, return an error
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    // If successful, return the user object
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// JWT Strategy to verify the token
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
}, async (jwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id);
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

export default passport;
