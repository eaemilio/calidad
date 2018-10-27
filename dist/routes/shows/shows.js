"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var express = _interopRequireWildcard(_express);

var _shows = require("../../db/queries/shows/shows");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = express.Router();

// *** get all *** //
router.get("/shows", async function (req, res, next) {
  try {
    var objs = await (0, _shows.getAll)();
    res.status(200).json(objs);
  } catch (error) {
    next(error);
  }
});

// *** get single *** //
router.get("/shows/:id", async function (req, res, next) {
  try {
    var obj = await (0, _shows.getSingle)(req.params.id);
    res.status(200).json(obj);
  } catch (error) {
    next(error);
  }
});

// *** insert *** //
router.post("/shows", async function (req, res, next) {
  try {
    var objId = await (0, _shows.add)(req.body);
    var obj = await (0, _shows.getSingle)(objId);
    res.json(obj);
  } catch (error) {
    next(error);
  }
});

// *** update *** //
router.put("/shows/:id", async function (req, res, next) {
  try {
    if (req.body.hasOwnProperty("id")) {
      return res.status(422).json({
        error: "You cannot update the id field"
      });
    }
    await (0, _shows.update)(req.params.id, req.body);
    var obj = await (0, _shows.getSingle)(req.params.id);

    res.status(200).json(obj);
  } catch (error) {
    next(error);
  }
});

// *** delete *** //
router.delete("/shows/:id", async function (req, res, next) {
  try {
    var obj = await (0, _shows.getSingle)(req.params.id);
    await (0, _shows.deleteItem)(req.params.id);
    res.status(200).json(obj);
  } catch (error) {
    next(error);
  }
});

exports.default = router;