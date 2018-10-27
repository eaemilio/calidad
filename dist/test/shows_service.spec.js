"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require("babel-polyfill");

var _shows = require("../db/queries/shows/shows");

var _chai = require("chai");

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require("../app");

var _app2 = _interopRequireDefault(_app);

var _knex = require("../db/knex");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = "test";

var should = (0, _chai.should)();

describe("query tests", function () {
    beforeEach(function (done) {
        (async function () {
            process.env.NODE_ENV = "test";
            await _knex.migrate.rollback();
            await _knex.migrate.latest();
            await _knex.seed.run();
            done();
        })();
    });

    afterEach(function (done) {
        (async function () {
            process.env.NODE_ENV = "test";
            await _knex.migrate.rollback();
            done();
        })();
    });

    describe("data service", async function () {
        it("Get all data should return an array", async function () {
            var shows = await (0, _shows.getAll)();
            shows.should.be.a("array");
            shows.length.should.equal(4);
        });

        it("Array of all data should return 4 elements ", async function () {
            var shows = await (0, _shows.getAll)();
            shows.length.should.equal(4);
        });
    });

    describe("Data service", async function () {
        it("Get all data should return an array", async function () {
            var shows = await (0, _shows.getAll)();
            shows.should.be.a("array");
            shows.length.should.equal(4);
        });

        it("Array of all data should return 4 elements ", async function () {
            var shows = await (0, _shows.getAll)();
            shows.length.should.equal(4);
        });
    });

    describe("Show Methods", async function () {
        it("Get Shows should be a function", async function () {
            (0, _chai.expect)(typeof _shows.getAll === "undefined" ? "undefined" : _typeof(_shows.getAll)).to.equal('function');
        });

        it("Get Single should be a function", async function () {
            (0, _chai.expect)(typeof _shows.getSingle === "undefined" ? "undefined" : _typeof(_shows.getSingle)).to.equal('function');
        });

        it("Add should be a function", async function () {
            (0, _chai.expect)(typeof _shows.add === "undefined" ? "undefined" : _typeof(_shows.add)).to.equal('function');
        });

        it("Delete should be a function", async function () {
            (0, _chai.expect)(typeof _shows.deleteItem === "undefined" ? "undefined" : _typeof(_shows.deleteItem)).to.equal('function');
        });

        it("Update should be a function", async function () {
            (0, _chai.expect)(typeof _shows.update === "undefined" ? "undefined" : _typeof(_shows.update)).to.equal('function');
        });
    });

    describe("Data content", async function () {
        it("Position 1 of data should have name Suits", async function () {
            var show = await (0, _shows.getSingle)(1);
            var name = show.name;
            name.should.equal('Suits');
        });

        it("Position 1 of data should have genre Drama", async function () {
            var show = await (0, _shows.getSingle)(1);
            var drama = show.genre;
            drama.should.equal('Drama');
        });

        it("Rating should be a number", async function () {
            var show = await (0, _shows.getSingle)(1);
            var rating = show.rating;
            (0, _chai.expect)(typeof rating === "undefined" ? "undefined" : _typeof(rating)).to.equal('number');
        });

        it("Explicit should be a number", async function () {
            var show = await (0, _shows.getSingle)(1);
            var explicit = show.explicit;
            (0, _chai.expect)(typeof explicit === "undefined" ? "undefined" : _typeof(explicit)).to.equal('number');
        });

        it("Position 1 of data should use USA Network channel", async function () {
            var show = await (0, _shows.getSingle)(1);
            var channel = show.channel;
            channel.should.equal('USA Network');
        });
    });
});