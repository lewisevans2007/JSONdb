/* JSONdb
 * Create databases using JSON
 * Github: https://github.com/awesomelewis2007/JSONdb
 * Author: Lewis Evans
*/

const fs = require("fs");
const path = require("path");
const colors = require("colors");

function log(message) {
    console.log(colors.blue("JSONdb: ") + colors.white(message));
}
function warn(message) {
    console.log(colors.yellow("JSONdb: ") + colors.white(message));
}
function error(message) {
    console.log(colors.red("JSONdb: ") + colors.white(message));
}
function major_error(message) {
    console.log(colors.bgRed("JSONdb ERROR: ") + colors.white(message));
}
function success(message) {
    console.log(colors.green("JSONdb: ") + colors.white(message));
}

class JSONdb {

    init(path, name, description) {
        if (fs.existsSync(path)) {
            major_error(`Database '${name}' already exists.`);
            return false;
        }

        const db = {
            meta: {
                name,
                description,
            },
            data: {},
        };

        try {
            fs.writeFileSync(path, JSON.stringify(db, null, 2));
            success(`Database '${name}' created at ${path}`);
        } catch (err) {
            major_error(`Failed to create database '${name}': ${err.message}`);
        }
        return true;
    }

    append(path, data, id = NaN) {
        if (!fs.existsSync(path)) {
            major_error(`Database '${path}' does not exist.`);
            return;
        }
        let db;
        try {
            const dbfile = fs.readFileSync(path);
            db = JSON.parse(dbfile);
        } catch (err) {
            major_error(`Failed to read database '${path}': ${err.message}`);
            return;
        }

        let new_id;
        if (isNaN(id)) {
            let i = 0;
            while (db.data[i]) {
                i++;
            }
            new_id = i;
        } else {
            new_id = id;
            if (db.data[id]) {
                warn(`ID '${id}' already exists in database '${path}'. Will use next available ID.`);
                let i = 0;
                while (db.data[i]) {
                    i++;
                }
                new_id = i;
            }
        }

        db.data[new_id] = data;
        
        try {
            fs.writeFileSync(path, JSON.stringify(db, null, 2));
            success(`Appended data to database '${path}'`);
        }
        catch (err) {
            major_error(`Failed to append data to database '${path}': ${err.message}`);
            return;
        }
        return id;
    }

    write(path, id, data) {
        if (!fs.existsSync(path)) {
            major_error(`Database '${path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(path);
            db = JSON.parse(dbfile);
        }
        catch (err) {
            major_error(`Failed to read database '${path}': ${err.message}`);
            return;
        }

        if (!db.data[id]) {
            error(`ID '${id}' does not exist in database '${path}'.`);
            return;
        }

        db.data[id] = data;
        try {
            fs.writeFileSync(path, JSON.stringify(db, null, 2));
            success(`Wrote data to database '${path}'`);
        }
        catch (err) {
            major_error(`Failed to write data to database '${path}': ${err.message}`);
            return;
        }

        return id;
    }

    read(path, id) {
        if (!fs.existsSync(path)) {
            major_error(`Database '${path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(path);
            db = JSON.parse(dbfile);
        }
        catch (err) {
            major_error(`Failed to read database '${path}': ${err.message}`);
            return;
        }

        if (!db.data[id]) {
            error(`ID '${id}' does not exist in database '${path}'.`);
            return;
        }

        return db.data[id];
    }

    delete(path, id) {
        if (!fs.existsSync(path)) {
            major_error(`Database '${path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(path);
            db = JSON.parse(dbfile);
        }
        catch (err) {
            major_error(`Failed to read database '${path}': ${err.message}`);
            return false;
        }

        if (!db.data[id]) {
            error(`ID '${id}' does not exist in database '${path}'.`);
            return false;
        }

        delete db.data[id];
        try {
            fs.writeFileSync(path, JSON.stringify(db, null, 2));
            success(`Deleted data from database '${path}'`);
        }
        catch (err) {
            major_error(`Failed to delete data from database '${path}': ${err.message}`);
            return;
        }

        return true;
    }
    
    list(path) {
        if (!fs.existsSync(path)) {
            major_error(`Database '${path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(path);
            db = JSON.parse(dbfile);
        }
        catch (err) {
            major_error(`Failed to read database '${path}': ${err.message}`);
            return;
        }

        return db.data;
    }

    clear(path) {
        if (!fs.existsSync(path)) {
            major_error(`Database '${path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(path);
            db = JSON.parse(dbfile);
        }
        catch (err) {
            major_error(`Failed to read database '${path}': ${err.message}`);
            return;
        }

        db.data = {};
        try {
            fs.writeFileSync(path, JSON.stringify(db, null, 2));
            success(`Cleared database '${path}'`);
        }
        catch (err) {
            major_error(`Failed to clear database '${path}': ${err.message}`);
            return;
        }
    }

    exists(path) {
        return fs.existsSync(path);
    }
}

module.exports = JSONdb;