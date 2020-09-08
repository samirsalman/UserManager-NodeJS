const cookieSchema = require("../models/Cookie");
const mongoose = require("mongoose");
var logger = require("tracer").colorConsole();
var hash = require("object-hash");

class CookieService {
  constructor() {
    this.Cookie = mongoose.model("Cookie", cookieSchema);
  }

  async verifyExpiredCookies() {
    var cookies = await this.Cookie.find({}).catch((err) => {
      logger.error(err);
    });
    var toDelete = [];
    for (const cookie in cookies) {
      console.log(cookies[cookie]);
      if (Date.parse(cookies[cookie].expires) < Date.now()) {
        toDelete.push(cookies[cookie].cookie);
      }
    }

    logger.trace(cookies);
    await this.Cookie.deleteMany({ cookie: { $in: toDelete } }).catch((err) => {
      logger.error(err);
    });

    logger.trace(toDelete);

    return;
  }

  async deleteCookie(email) {
    return await this.Cookie.deleteOne({ email: email }).catch((err) => {
      logger.error(err);
      return null;
    });
  }

  async verifyCookie(cookie) {
    logger.log(cookie);
    if (cookie === undefined) {
      return false;
    }

    var res = await this.Cookie.findOne({
      cookie: cookie.toString().split(";")[0].split("login=")[1],
    }).catch((err) => {
      return false;
    });

    var expires = Date.parse(res.expires);

    if (expires < Date.now()) {
      return false;
    } else {
      return true;
    }
  }

  async getEmailFromValidCookie(cookie) {
    var res = await this.Cookie.findOne({
      cookie: cookie.toString().split(";")[0].split("login=")[1],
    }).catch((err) => {
      logger.error(err);
      return null;
    });

    return res.email;
  }

  async addCookie(cookie, expires, email) {
    await this.Cookie.create({
      cookie: cookie,
      expires: expires,
      email: email,
    }).catch((err) => {
      logger.error(err);
    });
    return;
  }
}

module.exports = CookieService;
