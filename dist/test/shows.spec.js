process.env.NODE_ENV = "test";

import "babel-polyfill";
import { should as _should, use, request } from "chai";
import chaiHttp from "chai-http";
import server from "../app";
import { migrate, seed } from "../db/knex";
import { getAll } from "../db/queries/shows/shows";

var should = _should();

use(chaiHttp);

describe("API Routes", () => {
    beforeEach(done => {
        (async () => {
            process.env.NODE_ENV = "test";
            await migrate.rollback();
            await migrate.latest();
            await seed.run();
            done();
        })();
    });

    afterEach(done => {
        (async () => {
            process.env.NODE_ENV = "test";
            await migrate.rollback();
            done();
        })();
    });

    describe("GET /api/v1/shows", () => {
        it("should return all shows", done => {
            request(server).get("/api/v1/shows").end((err, res) => {
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

    describe("GET /api/v1/shows/:id", () => {
        it("should return a single show", done => {
            request(server).get("/api/v1/shows/1").end((err, res) => {
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

    describe("POST /api/v1/shows", () => {
        it("should add a show", done => {
            request(server).post("/api/v1/shows").send({
                name: "Family Guy",
                channel: "Fox",
                genre: "Comedy",
                rating: 4,
                explicit: true
            }).end((err, res) => {
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

    describe("PUT /api/v1/shows/:id", () => {
        it("should update a show", done => {
            request(server).put("/api/v1/shows/1").send({
                rating: 4,
                explicit: true
            }).end((err, res) => {
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

    describe("DELETE /api/v1/shows/:id", () => {
        it("should delete a show", done => {
            request(server).delete("/api/v1/shows/1").end((error, response) => {
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
                request(server).get("/api/v1/shows").end((err, res) => {
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