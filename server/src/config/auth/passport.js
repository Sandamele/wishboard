import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/users/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const roles = req.session.role || "user";
        const authType = req.session.authType || "login";
        let user = await prisma.user.findUnique({
          where: {
            email: profile.emails[0].value.toString(),
          },
        });
        if (!user && authType === "register") {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value.toString(),
              username: profile.emails[0].value
                .split("@")[0]
                .toString(),
              provider: "google",
              roles,
            },
          });
        }
        if (!user && authType === "login") {
          return done(null, false, {
            message: "Account not found. Please register first.",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
