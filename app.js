require("dotenv").config({ path: "./data.env" });

//const declaring
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const cookieService = require("./services/CookieService");
var CookieService = new cookieService();

const TIME_TO_VERIFY = 60 * 3600 * 24;

CookieService.verifyExpiredCookies();

setInterval(() => {
  CookieService.verifyExpiredCookies();
}, TIME_TO_VERIFY);

//define the port on which the server will listen
const PORT = process.env.PORT || 3000;

//limit the number of requests from the same user
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: true,
    message: "Too many requests, please try again later.",
  },
});
var logger = require("tracer").colorConsole();

app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all("/", (req, res, next) => {
  logger.log(req.ip, req.hostname, req.originalUrl);
  next();
});

async function startMongoDB() {
  logger.log(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`);
  mongoose
    .connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((val) => {
      logger.log("DB started");
    })
    .catch((err) => {
      logger.error(err);
      return;
    });
}

app.listen(PORT, startMongoDB(), function () {
  console.log(`I'm listening on port : `, PORT);
});

const userRoute = require("./api-routes/userRoute.js");
app.use("/users", userRoute);
