"use strict";

process.env.NODE_ENV = "test";

import "babel-polyfill";
import { getAll, getSingle, add, update, deleteItem } from "../db/queries/shows/shows";
import { should as _should, use, request, expect } from "chai";
import chaiHttp from "chai-http";
import server from "../app";
import { migrate, seed } from "../db/knex";
var should = _should();

describe("query tests", () => {
    beforeEach((done) => {
        (async () => {
            process.env.NODE_ENV = "test";
            await migrate.rollback();
            await migrate.latest();
            await seed.run();
            done();
        })();
    });

    afterEach((done) => {
        (async () => {
            process.env.NODE_ENV = "test";
            await migrate.rollback();
            done();
        })();
    });


    describe("data service", async () => {
        it("Get all data should return an array", async () => {
            let shows = await getAll();
            shows.should.be.a("array");
            shows.length.should.equal(4);
        });

        it("Array of all data should return 4 elements ", async () => {
            let shows = await getAll();
            shows.length.should.equal(4);
        });
    });

    describe("Show Methods", async() => {
        it("Get Shows should be a function", async () => {
            expect(typeof getAll).to.equal('function');
        });

        it("Get Single should be a function", async () => {
            expect(typeof getSingle).to.equal('function');
        });

        it("Add should be a function", async () => {
            expect(typeof add).to.equal('function');
        });

        it("Delete should be a function", async () => {
            expect(typeof deleteItem).to.equal('function');
        });

        it("Update should be a function", async () => {
            expect(typeof update).to.equal('function');
        });
    });

    describe("Data content", async () => {
        it("Position 1 of data should have name Suits", async() => {
            const show = await getSingle(1);
            const name = show.name;
            name.should.equal('Suits');
        });

        it("Position 1 of data should have genre Drama", async() => {
            const show = await getSingle(1);
            const drama = show.genre;
            drama.should.equal('Drama');
        });

        it("Rating should be a number", async() => {
            const show = await getSingle(1);
            const rating = show.rating;
            expect(typeof rating).to.equal('number');
        });

        it("Explicit should be a number", async() => {
            const show = await getSingle(1);
            const explicit = show.explicit;
            expect(typeof explicit).to.equal('number');
        });

        it("Position 1 of data should use USA Network channel", async() => {
            const show = await getSingle(1);
            const channel = show.channel;
            channel.should.equal('USA Network');
        });
    });

});
