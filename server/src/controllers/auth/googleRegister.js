import passport from "passport";

export function googleRegister(req, res, next) {
  req.session.authType = "register";
  req.session.role = req.query.role || "user";

  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
}