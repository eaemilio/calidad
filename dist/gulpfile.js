"use strict";

var gulp = require("gulp-param")(require("gulp"), process.argv);
var service = require("./gulp/service");

gulp.task("service", service); // ex: gulp service --name invoice --column InvoiceId