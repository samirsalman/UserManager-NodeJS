const userSchema = require("../models/User");
const mongoose = require("mongoose");
var logger = require("tracer").colorConsole();
var hash = require("object-hash");
var validator = require("validator");
const cookieService = require("../services/CookieService");
var CookieService = new cookieService();

class UserService {
  constructor() {
    this.User = mongoose.model("User", userSchema);
  }

  async login(user, cookie) {
    if (!(await CookieService.verifyCookie(cookie))) {
      var res = await this.User.findOne({
        email: user.email,
        password: hash(user.password),
      }).catch((err) => {
        return { error: true, message: err };
      });
      if (res === null) {
        return { error: true, message: "No user found" };
      }

      res.password = undefined;
      return { error: false, message: "Login successfully", data: res };
    } else {
      var email = await CookieService.getEmailFromValidCookie(cookie);
      var login = await this.loginWithCookie(email);
      if (login !== null) {
        logger.trace("Login with cookie");
        return {
          error: false,
          message: "Login with cookie successfully",
          data: login,
        };
      } else {
        return { error: true, message: "Error" };
      }
    }
  }

  async logout(user) {
    await CookieService.deleteCookie(user.email);
    return { error: false, message: "Logout successful" };
  }

  async loginWithCookie(email) {
    return await this.User.findOne({ email: email }).catch((err) => {
      logger.error(err);
      return null;
    });
  }

  async buyPro(user) {
    await this.User.updateOne({ email: user.email }, { isPro: true }).catch(
      (err) => {
        logger.error(err);
        return { error: true, message: err };
      }
    );
    logger.info("Pro bought successfully", user);
    return { error: false, message: "Pro bought successfully" };
  }

  async createUser(user) {
    if (!validator.isEmail(user.email)) {
      return { error: true, message: "No valid email" };
    }

    if (this.validateUser()) {
      var isSub = await this.isAlreadySub(user.email);
      if (isSub) {
        return { error: true, message: "User already exists" };
      } else {
        var userTemp = new this.User({
          name: user.name,
          lastName: user.lastName,
          years: user.years,
          city: user.city,
          email: user.email,
          password: hash(user.password),
        });
        await this.User.create(userTemp).catch((err) => {
          return { error: true, message: err };
        });

        return { error: false, message: "User created" };
      }
    } else {
      return { error: true, message: "User not valid" };
    }
  }

  async isAlreadySub(email) {
    var res = await this.User.findOne({ email: email })
      .exec()
      .catch((error) => {
        logger.error(error);
        return null;
      });

    if (res === null) {
      logger.log("No user already exists");
      return false;
    } else {
      logger.log("This user already exists");
      return true;
    }
  }

  validateUser(body) {
    var error = this.User(body).validateSync();
    if (error) {
      logger.error(error);
      return false;
    }
    logger.log("Valid email");
    return true;
  }

  async getUsers() {
    var users = await this.User.find({}).catch((err) => {
      return { error: true, message: err };
    });
    logger.log("getUsers");
    return users;
  }

  async deleteUser(email, password) {
    await this.User.findOneAndDelete({
      email: email,
      password: hash(password),
    }).catch((err) => {
      logger.error(err);
      return { error: true, message: err };
    });
  }

  async updateUser(user) {
    await this.User.updateOne(
      { email: user.email },
      {
        email: user.email,
        password: hash(user.password),
        name: user.name,
        lastName: user.lastName,
      }
    ).catch((err) => {
      return { error: true, message: err };
    });
    return { error: false, message: "User updated", data: user };
  }

  async changeEmail(user) {
    await this.User.updateOne(
      { email: user.email },
      {
        email: user.newEmail,
      }
    ).catch((err) => {
      return { error: true, message: err };
    });
    return { error: false, message: "User updated", data: user };
  }

  async changePassword(user) {
    logger.log(user);

    var userUpdated = await this.User.updateOne(
      { email: user.email },
      {
        password: hash(user.newPassword),
      }
    ).catch((err) => {
      return { error: true, message: err };
    });

    logger.log(userUpdated);
    return { error: false, message: "User updated", data: user };
  }
}

module.exports = UserService;
