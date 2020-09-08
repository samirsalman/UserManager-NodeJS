console.log("Verify cookies expired script");
console.log(new Date(Date.now()).getSeconds());
const cookieService = require("../services/CookieService");
var CookieService = new cookieService();
CookieService.verifyExpiredCookies();
