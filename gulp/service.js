let gulp = require('gulp-param')(require('gulp'), process.argv);
let file = require('gulp-file');
let _ = require('lodash');
let fs = require('fs');
let footer = require('gulp-footer');
let header = require('gulp-header');
let deleteLines = require('gulp-delete-lines');

function getQueryTemplate(name, idColumn) {
    return `import knex from "../../knex.js";

function ${name}() {
    return knex("${name}");
}

// *** CRUD *** //

export const getAll = () => {
    return ${name}().select();
};

export const getSingle = id => {
    return ${name}()
    .where("${idColumn}", parseInt(id))
    .first();
};

export const add = show => {
    return ${name}().insert(show, "${idColumn}");
};

export const update = (id, updates) => {
    return ${name}()
    .where("${idColumn}", parseInt(id))
    .update(updates);
};

export const deleteItem = id => {
    return ${name}()
    .where("${idColumn}", parseInt(id))
    .del();
};
    `
}

function getRoutesTemplate(name, fileName, idColumn) {
    return `"use strict";

import * as express from "express";
var router = express.Router();

import { getAll, getSingle, add, update, deleteItem } from '../../db/queries/${fileName}/${fileName}';

// *** get all *** //
router.get("/${fileName}", async (req, res, next) => {
    try {
    let objs = await getAll();
    res.status(200).json(objs);
    } catch (error) {
    next(error);
    }
});

// *** get single *** //
router.get("/${fileName}/:id", async (req, res, next) => {
    try {
    let obj = await getSingle(req.params.id);
    res.status(200).json(obj);
    } catch (error) {
    next(error);
    }
});

// *** insert *** //
router.post("/${fileName}", async (req, res, next) => {
    try {
    let objId = await add(req.body);
    let obj = await getSingle(objId);
    res.json(obj);
    } catch (error) {
    next(error);
    }
});

// *** update *** //
router.put("/${fileName}/:id", async (req, res, next) => {
    try {
    if (req.body.hasOwnProperty("${idColumn}")) {
        return res.status(422).json({
        error: "You cannot update the id field"
        });
    }
    await update(req.params.id, req.body);
    let obj = await getSingle(req.params.id);

    res.status(200).json(obj);
    } catch (error) {
    next(error);
    }
});

// *** delete *** //
router.delete("/${fileName}/:id", async (req, res, next) => {
    try {
    let obj = await getSingle(req.params.id);
    await deleteItem(req.params.id);
    res.status(200).json(obj);
    } catch (error) {
    next(error);
    }
});

export default router;
`
}

function getQueryObject(name) {
    let fileName = _.snakeCase(name).replace('_', '-');
    let tableName = _.startCase(_.camelCase(name)).replace(' ', '');
    let queriesPath = `db/queries`;
    let newQueryModulePath = `${queriesPath}/${fileName}`;
    
    let routesPath = `routes`;
    let newRouteModulePath = `${routesPath}/${fileName}`;
    return {
        fileName: fileName,
        tableName: tableName,
        queriesPath: queriesPath,
        newQueryModulePath: newQueryModulePath,
        newRouteModulePath: newRouteModulePath
    };

}

gulp.task('createQuery', function (name, column) {
    let queryObject = getQueryObject(name);

    if (fs.existsSync(queryObject.newQueryModulePath))
        throw new Error("Query already exists!!");

    return file(`${queryObject.fileName}.js`, getQueryTemplate(queryObject.tableName, column))
        .pipe(gulp.dest(queryObject.newQueryModulePath));
});

gulp.task('createRoutes', function(name, column) {
    let queryObject = getQueryObject(name);

    if (fs.existsSync(queryObject.newRouteModulePath))
        throw new Error("Route already exists!!");

    return file(`${queryObject.fileName}.js`, getRoutesTemplate(queryObject.tableName, queryObject.fileName, column))
        .pipe(gulp.dest(queryObject.newRouteModulePath));
});

gulp.task('registerRoutes', function(name, column) {
    let queryObject = getQueryObject(name);

    return gulp.src('./routes/index.js')
        .pipe(header(`import ${queryObject.fileName} from "./${queryObject.fileName}/${queryObject.fileName}";\n`))
        .pipe(deleteLines({
            'filters': [
                /\} \/\* end of module \*\//i
            ]
        }))
        .pipe(footer(`\n    app.use("/api/v1", ${queryObject.fileName});`))
        .pipe(footer(`\n} /* end of module */`))
        .pipe(gulp.dest('./routes/', { overwrite: true }))
});

let generateQueryTasks = ['createQuery', 'createRoutes', 'registerRoutes']

module.exports = generateQueryTasks;