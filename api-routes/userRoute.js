const userService = require("../services/UserService");
const express = require("express");
const router = express.Router();
var logger = require("tracer").colorConsole();
var hash = require("object-hash");
const cookieService = require("../services/CookieService");

var CookieService = new cookieService();
const UserService = new userService();

router.post("/createUser", (req, res, next) => {
  UserService.createUser(req.body).then((user) => {
    if (user.error) {
      res.status(500).send(user);
    } else {
      res.status(200).send(user);
    }
  });
});

router.post("/login", (req, res, next) => {
  UserService.login(req.body, req.headers.cookie).then((user) => {
    if (user.error) {
      res.status(500).send(user);
    } else {
      var cookie = hash(user.data + Date.now().toLocaleString());
      var expires = new Date(Date.now());
      expires.setDate(expires.getDate() + 1);
      CookieService.addCookie(cookie, expires, req.body.email).then(() => {
        res.setHeader("Set-Cookie", `login=${cookie}; expires= ${expires}`);
        res.status(200).send(user);
      });
    }
  });
});

router.get("/getUsers", (req, res, next) => {
  UserService.getUsers().then((users) => {
    if (users.error) {
      res.status(500).send(users);
    } else {
      res.status(200).send(users);
    }
  });
});

router.delete("/deleteUser", (req, res, next) => {
  UserService.deleteUser(req.body.email, req.body.password).then((value) => {
    if (value.error) {
      res.status(404).send(value);
    } else {
      res.status(200).send(value);
    }
  });
});

router.patch("/updateUser", (req, res, next) => {
  UserService.updateUser(req.body).then((user) => {
    if (user.error) {
      res.status(404).send(user);
    } else {
      res.status(200).send(user);
    }
  });
});

router.patch("/updateUser/email", (req, res, next) => {
  logger.trace(req.hostname, req.ip, DateTime.now(), "updateEmail");
  UserService.changeEmail(req.body).then((user) => {
    if (user.error) {
      res.status(404).send(user);
    } else {
      res.status(200).send(user);
    }
  });
});

router.patch("/updateUser/password", (req, res, next) => {
  logger.trace(req.hostname, req.ip, DateTime.now(), "updatePassword");

  UserService.changePassword(req.body).then((user) => {
    if (user.error) {
      res.status(404).send(user);
    } else {
      res.status(200).send(user);
    }
  });
});

router.post("/buyPro", (req, res, next) => {
  logger.trace(req.hostname, req.ip, Date.now(), "buyPro");

  UserService.buyPro(req.body).then((user) => {
    if (user.error) {
      res.status(404).send(user);
    } else {
      res.status(200).send(user);
    }
  });
});

router.post("/logout", (req, res, next) => {
  if (req.headers.cookie !== undefined) {
    req.headers.cookie = undefined;
    res.removeHeader("Set-Cookie");
  }

  UserService.logout(req.body).then((user) => {
    if (user.error) {
      res.status(404).send(user);
    } else {
      res.status(200).send(user);
    }
  });
});

module.exports = router;
