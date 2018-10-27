"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteItem = exports.update = exports.add = exports.getSingle = exports.getAll = undefined;

var _knex = require("../../knex.js");

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Shows() {
  return (0, _knex2.default)("shows");
}

// *** CRUD *** //

var getAll = exports.getAll = function getAll() {
  return Shows().select();
};

var getSingle = exports.getSingle = function getSingle(id) {
  return Shows().where("id", parseInt(id)).first();
};

var add = exports.add = function add(show) {
  return Shows().insert(show, "id");
};

var update = exports.update = function update(id, updates) {
  return Shows().where("id", parseInt(id)).update(updates);
};

var deleteItem = exports.deleteItem = function deleteItem(id) {
  return Shows().where("id", parseInt(id)).del();
};