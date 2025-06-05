import passport from "passport";
export function googleLogin(req, res, next) {
  req.session.authType = "login";

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}
