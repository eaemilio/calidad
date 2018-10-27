"use strict";

require("babel-polyfill");

var _chai = require("chai");

var _chaiHttp = require("chai-http");

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require("../app");

var _app2 = _interopRequireDefault(_app);

var _knex = require("../db/knex");

var _shows = require("../db/queries/shows/shows");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = "test";

var should = (0, _chai.should)();

(0, _chai.use)(_chaiHttp2.default);

describe("API Routes", function () {
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

    describe("GET /api/v1/shows", function () {
        it("should return all shows", function (done) {
            (0, _chai.request)(_app2.default).get("/api/v1/shows").end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a("array");
                res.body.length.should.equal(4);
                res.body[0].should.have.property("name");
                res.body[0].name.should.equal("Suits");
                res.body[0].should.have.property("channel");
                res.body[0].channel.should.equal("USA Network");
                res.body[0].should.have.property("genre");
                res.body[0].genre.should.equal("Drama");
                res.body[0].should.have.property("rating");
                res.body[0].rating.should.equal(3);
                res.body[0].should.have.property("explicit");
                res.body[0].explicit.should.equal(0);
                done();
            });
        });
    });

    describe("GET /api/v1/shows/:id", function () {
        it("should return a single show", function (done) {
            (0, _chai.request)(_app2.default).get("/api/v1/shows/1").end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a("object");
                res.body.should.have.property("name");
                res.body.name.should.equal("Suits");
                res.body.should.have.property("channel");
                res.body.channel.should.equal("USA Network");
                res.body.should.have.property("genre");
                res.body.genre.should.equal("Drama");
                res.body.should.have.property("rating");
                res.body.rating.should.equal(3);
                res.body.should.have.property("explicit");
                res.body.explicit.should.equal(0);
                done();
            });
        });
    });

    describe("POST /api/v1/shows", function () {
        it("should add a show", function (done) {
            (0, _chai.request)(_app2.default).post("/api/v1/shows").send({
                name: "Family Guy",
                channel: "Fox",
                genre: "Comedy",
                rating: 4,
                explicit: true
            }).end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a("object");
                res.body.should.have.property("name");
                res.body.name.should.equal("Family Guy");
                res.body.should.have.property("channel");
                res.body.channel.should.equal("Fox");
                res.body.should.have.property("genre");
                res.body.genre.should.equal("Comedy");
                res.body.should.have.property("rating");
                res.body.rating.should.equal(4);
                res.body.should.have.property("explicit");
                res.body.explicit.should.equal(1);
                done();
            });
        });
    });

    describe("PUT /api/v1/shows/:id", function () {
        it("should update a show", function (done) {
            (0, _chai.request)(_app2.default).put("/api/v1/shows/1").send({
                rating: 4,
                explicit: true
            }).end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json; // jshint ignore:line
                res.body.should.be.a("object");
                res.body.should.have.property("name");
                res.body.name.should.equal("Suits");
                res.body.should.have.property("channel");
                res.body.channel.should.equal("USA Network");
                res.body.should.have.property("genre");
                res.body.genre.should.equal("Drama");
                res.body.should.have.property("rating");
                res.body.rating.should.equal(4);
                res.body.should.have.property("explicit");
                res.body.explicit.should.equal(1);
                done();
            });
        });
    });

    describe("DELETE /api/v1/shows/:id", function () {
        it("should delete a show", function (done) {
            (0, _chai.request)(_app2.default).delete("/api/v1/shows/1").end(function (error, response) {
                response.should.have.status(200);
                response.should.be.json; // jshint ignore:line
                response.body.should.be.a("object");
                response.body.should.have.property("name");
                response.body.name.should.equal("Suits");
                response.body.should.have.property("channel");
                response.body.channel.should.equal("USA Network");
                response.body.should.have.property("genre");
                response.body.genre.should.equal("Drama");
                response.body.should.have.property("rating");
                response.body.rating.should.equal(3);
                response.body.should.have.property("explicit");
                response.body.explicit.should.equal(0);
                (0, _chai.request)(_app2.default).get("/api/v1/shows").end(function (err, res) {
                    res.should.have.status(200);
                    res.should.be.json; // jshint ignore:line
                    res.body.should.be.a("array");
                    res.body.length.should.equal(3);
                    res.body[0].should.have.property("name");
                    res.body[0].name.should.equal("Game of Thrones");
                    res.body[0].should.have.property("channel");
                    res.body[0].channel.should.equal("HBO");
                    res.body[0].should.have.property("genre");
                    res.body[0].genre.should.equal("Fantasy");
                    res.body[0].should.have.property("rating");
                    res.body[0].rating.should.equal(5);
                    res.body[0].should.have.property("explicit");
                    res.body[0].explicit.should.equal(1);
                    done();
                });
            });
        });
    });
});