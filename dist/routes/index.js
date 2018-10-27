"use strict";

var _shows = require("./shows/shows");

var _shows2 = _interopRequireDefault(_shows);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (app) {
    app.use("/api/v1", _shows2.default);
}; /* end of module */