"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var _serveFavicon = require("serve-favicon");

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require("body-parser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// view engine setup
app.set("views", (0, _path.join)(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (process.env.NODE_ENV !== "test") {
  app.use((0, _morgan2.default)("dev"));
}
app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use(_express2.default.static((0, _path.join)(__dirname, "public")));
app.use((0, _cors2.default)());

// Loads all the routes from the /routes/index.js file
require("./routes")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

exports.default = app;