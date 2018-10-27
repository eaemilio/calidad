'use strict';

var gulp = require('gulp-param')(require('gulp'), process.argv);
var file = require('gulp-file');
var _ = require('lodash');
var fs = require('fs');
var footer = require('gulp-footer');
var header = require('gulp-header');
var deleteLines = require('gulp-delete-lines');

function getQueryTemplate(name, idColumn) {
    return 'import knex from "../../knex.js";\n\nfunction ' + name + '() {\n    return knex("' + name + '");\n}\n\n// *** CRUD *** //\n\nexport const getAll = () => {\n    return ' + name + '().select();\n};\n\nexport const getSingle = id => {\n    return ' + name + '()\n    .where("' + idColumn + '", parseInt(id))\n    .first();\n};\n\nexport const add = show => {\n    return ' + name + '().insert(show, "' + idColumn + '");\n};\n\nexport const update = (id, updates) => {\n    return ' + name + '()\n    .where("' + idColumn + '", parseInt(id))\n    .update(updates);\n};\n\nexport const deleteItem = id => {\n    return ' + name + '()\n    .where("' + idColumn + '", parseInt(id))\n    .del();\n};\n    ';
}

function getRoutesTemplate(name, fileName, idColumn) {
    return '"use strict";\n\nimport * as express from "express";\nvar router = express.Router();\n\nimport { getAll, getSingle, add, update, deleteItem } from \'../../db/queries/' + fileName + '/' + fileName + '\';\n\n// *** get all *** //\nrouter.get("/' + fileName + '", async (req, res, next) => {\n    try {\n    let objs = await getAll();\n    res.status(200).json(objs);\n    } catch (error) {\n    next(error);\n    }\n});\n\n// *** get single *** //\nrouter.get("/' + fileName + '/:id", async (req, res, next) => {\n    try {\n    let obj = await getSingle(req.params.id);\n    res.status(200).json(obj);\n    } catch (error) {\n    next(error);\n    }\n});\n\n// *** insert *** //\nrouter.post("/' + fileName + '", async (req, res, next) => {\n    try {\n    let objId = await add(req.body);\n    let obj = await getSingle(objId);\n    res.json(obj);\n    } catch (error) {\n    next(error);\n    }\n});\n\n// *** update *** //\nrouter.put("/' + fileName + '/:id", async (req, res, next) => {\n    try {\n    if (req.body.hasOwnProperty("' + idColumn + '")) {\n        return res.status(422).json({\n        error: "You cannot update the id field"\n        });\n    }\n    await update(req.params.id, req.body);\n    let obj = await getSingle(req.params.id);\n\n    res.status(200).json(obj);\n    } catch (error) {\n    next(error);\n    }\n});\n\n// *** delete *** //\nrouter.delete("/' + fileName + '/:id", async (req, res, next) => {\n    try {\n    let obj = await getSingle(req.params.id);\n    await deleteItem(req.params.id);\n    res.status(200).json(obj);\n    } catch (error) {\n    next(error);\n    }\n});\n\nexport default router;\n';
}

function getQueryObject(name) {
    var fileName = _.snakeCase(name).replace('_', '-');
    var tableName = _.startCase(_.camelCase(name)).replace(' ', '');
    var queriesPath = 'db/queries';
    var newQueryModulePath = queriesPath + '/' + fileName;

    var routesPath = 'routes';
    var newRouteModulePath = routesPath + '/' + fileName;
    return {
        fileName: fileName,
        tableName: tableName,
        queriesPath: queriesPath,
        newQueryModulePath: newQueryModulePath,
        newRouteModulePath: newRouteModulePath
    };
}

gulp.task('createQuery', function (name, column) {
    var queryObject = getQueryObject(name);

    if (fs.existsSync(queryObject.newQueryModulePath)) throw new Error("Query already exists!!");

    return file(queryObject.fileName + '.js', getQueryTemplate(queryObject.tableName, column)).pipe(gulp.dest(queryObject.newQueryModulePath));
});

gulp.task('createRoutes', function (name, column) {
    var queryObject = getQueryObject(name);

    if (fs.existsSync(queryObject.newRouteModulePath)) throw new Error("Route already exists!!");

    return file(queryObject.fileName + '.js', getRoutesTemplate(queryObject.tableName, queryObject.fileName, column)).pipe(gulp.dest(queryObject.newRouteModulePath));
});

gulp.task('registerRoutes', function (name, column) {
    var queryObject = getQueryObject(name);

    return gulp.src('./routes/index.js').pipe(header('import ' + queryObject.fileName + ' from "./' + queryObject.fileName + '/' + queryObject.fileName + '";\n')).pipe(deleteLines({
        'filters': [/\} \/\* end of module \*\//i]
    })).pipe(footer('\n    app.use("/api/v1", ' + queryObject.fileName + ');')).pipe(footer('\n} /* end of module */')).pipe(gulp.dest('./routes/', { overwrite: true }));
});

var generateQueryTasks = ['createQuery', 'createRoutes', 'registerRoutes'];

module.exports = generateQueryTasks;