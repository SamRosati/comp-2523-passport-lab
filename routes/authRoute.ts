import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const messages = (req.session as any).messages;
  res.render("login", { messages: messages ? { error: messages[0] } : {} });
  if (messages) delete (req.session as any).messages;
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: "Incorrect password", // This enables the storage of error messages in the session
  })
);

// Route to trigger GitHub login
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Callback route where GitHub sends the user back
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
