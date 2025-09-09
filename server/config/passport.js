import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
  algorithms: ["HS256"],
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id).select("-password");

      if (user && user.isActive) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      console.error("JWT Strategy Error:", error);
      return done(error, false);
    }
  })
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update last login
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Check if user exists with this email (local account)
        user = await User.findOne({
          email: profile.emails[0].value.toLowerCase(),
        });

        if (user) {
          // Link Google account to existing local account
          user.googleId = profile.id;
          user.provider = "google";
          user.isVerified = true; // Auto-verify Google users
          user.lastLogin = new Date();

          // Update avatar if not already set
          if (!user.avatar && profile.photos && profile.photos.length > 0) {
            user.avatar = profile.photos[0].value;
          }

          await user.save();
          return done(null, user);
        }

        // Create new user account
        const newUser = new User({
          googleId: profile.id,
          provider: "google",
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value.toLowerCase(),
          avatar:
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : null,
          isVerified: true, // Auto-verify Google users
          role: "user",
          lastLogin: new Date(),
        });

        // Check if this is the admin user
        if (newUser.email === process.env.ADMIN_EMAIL) {
          newUser.role = "admin";
        }

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session (though we're using JWT, this is still needed)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Middleware to extract JWT from cookies as well
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

// Alternative JWT strategy that checks both headers and cookies
passport.use(
  "jwt-cookie",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
      algorithms: ["HS256"],
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id).select("-password");

        if (user && user.isActive) {
          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        console.error("JWT Cookie Strategy Error:", error);
        return done(error, false);
      }
    }
  )
);

export default  passport;
