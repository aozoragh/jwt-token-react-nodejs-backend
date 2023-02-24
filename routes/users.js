const express = require("express");
const router = express.Router();

//@import models

const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
// const passport = require("passport");
//@import validation
const validateLoginInput = require("../validation/login");

router.post("/test", async (req, res) => {
  return res.json({ mesg: "working" });
});

// @route    POST users/login
// @desc     Login user
// @access   Public
router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const name = req.body.username;
  const password = req.body.password;

  // Find user by email
  const payload = {
    name: name,
    password: password,
  };
  const access_token = await jwt.sign(
    payload,
    keys.secretOrKey,
    { expiresIn: 5 }
  );
  const refresh_token = await jwt.sign(
    payload,
    keys.refresh_token,
    { expiresIn: 3600 * 24 * 15 }
  );

  res.json({
    success: true,
    access_token: "Bearer " + access_token,
    refresh_token: "Bearer " + refresh_token,
  });
});

// @route    GET users/refresh-token
// @desc     Login user
// @access   Public
router.post("/refresh-token", async (req, res) => {
  // console.log("refresh token func", jwt.verify(refresh_token, keys.refresh_token));
  // verify refresh-token
  const refresh_token = req.body[0];
  const decoded = req.body[1];
  const decoded_token = jwt.verify(refresh_token.slice(7), keys.refresh_token);
  // const decoded_token = 1;
  const payload = {
    name: decoded.name,
    password: decoded.password,
  }
  if (decoded_token) {
    const access_token = await jwt.sign(
      payload,
      keys.secretOrKey,
      { expiresIn: 5 }
      // { expiresIn: 3600 * 24 * 3 }
    );
    res.json({
      success: true,
      access_token: access_token
    });
  }

});

// @route   GET users/current
// @desc    Return current user
// @access  Private
// router.get(
//   "/current",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     return res.status(200).json(req.user);
//   }
// );
module.exports = router;
