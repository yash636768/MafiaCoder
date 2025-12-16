import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user (store id in session/token) - mostly for session based, but we use JWT.
// We might not strictly need full serialization if we just issue JWTs in the callback,
// but Passport requires at least dummy serializers often if sessions are used.
// Since we are likely using a stateless JWT approach for the API, we might skip session usage
// in the index.ts middleware, but let's define these just in case or for future session use.
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'place_holder_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'place_holder_secret',
    callbackURL: "/api/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await User.findOne({ email: profile.emails?.[0].value });

            if (user) {
                // If user exists but no googleId (legacy or other login), link it?
                // For now, simpler to just return the user.
                if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }
                return done(null, user);
            }

            // Create new user
            // Generate a random password or leave empty since social login
            user = new User({
                username: profile.displayName.replace(/\s+/g, '') + Math.floor(Math.random() * 1000), // simplistic username generation
                email: profile.emails?.[0].value,
                googleId: profile.id,
                avatar: profile.photos?.[0].value,
                password: '' // No password for social login
            });

            await user.save();
            return done(null, user);

        } catch (err) {
            return done(err, undefined);
        }
    }
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'place_holder_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'place_holder_secret',
    callbackURL: "/api/auth/github/callback",
    scope: ['user:email'] // Request email access
},
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
            // GitHub might not return email in public profile if private, needing extra fetch,
            // but passport-github2 usually handles scope 'user:email' well if profile.emails is populated.
            const email = profile.emails?.[0]?.value || `${profile.username}@no-email.github.com`;

            let user = await User.findOne({ $or: [{ githubId: profile.id }, { email }] });

            if (user) {
                if (!user.githubId) {
                    user.githubId = profile.id;
                    await user.save();
                }
                return done(null, user);
            }

            user = new User({
                username: profile.username,
                email: email,
                githubId: profile.id,
                avatar: profile.photos?.[0]?.value,
                password: '',
                bio: profile._json?.bio
            });

            await user.save();
            return done(null, user);

        } catch (err) {
            return done(err, undefined);
        }
    }
));

export default passport;
