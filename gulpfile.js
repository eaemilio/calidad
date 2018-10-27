let gulp = require("gulp-param")(require("gulp"), process.argv);
let service = require("./gulp/service");

gulp.task("service", service); // ex: gulp service --name invoice --column InvoiceId
