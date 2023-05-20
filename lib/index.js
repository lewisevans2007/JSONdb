/* JSONdb
 * Create databases using JSON
 * Github: https://github.com/awesomelewis2007/JSONdb
 * Licence: GNU General Public License v3.0
 * By: Lewis Evans
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
    constructor(filename) {
        this.path = path.join(process.cwd(), filename);
    }

    /**
     * Creates a new database with a given name and description
     * @param {string} name name of the database
     * @param {string} description description of the database
     * @returns true if successful, false if not
     */
    init(name, description) {
        if (fs.existsSync(this.path)) {
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
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Database '${name}' created at ${this.path}`);
        } catch (err) {
            major_error(`Failed to create database '${name}': ${err.message}`);
            return false;
        }
        return true;
    }

    /**
     * Add data to the database
     * @param {string} data data to append to the database
     * @param {integer} id id to append the data to (optional - if not passed then it will append to the next available id)
     * @returns id if successful, nothing if not
     */
    append(data, id = NaN) {
        if (!fs.existsSync(this.path)) {
            major_error(`Database '${this.path}' does not exist.`);
            return;
        }
        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            major_error(`Failed to read database '${this.path}': ${err.message}`);
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
                warn(`ID '${id}' already exists in database '${this.path}'. Will use next available ID.`);
                let i = 0;
                while (db.data[i]) {
                    i++;
                }
                new_id = i;
            }
        }

        db.data[new_id] = data;

        try {
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Appended data to database '${this.path}'`);
        } catch (err) {
            major_error(`Failed to append data to database '${this.path}': ${err.message}`);
            return;
        }
        return id;
    }

    /**
     * Add data to the database with a given id
     * @param {integer} id id to write the data to
     * @param {string} data the data to write
     * @returns 
     */
    write(id, data) {
        if (!fs.existsSync(this.path)) {
            major_error(`Database '${this.path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            major_error(`Failed to read database '${this.path}': ${err.message}`);
            return;
        }

        if (!db.data[id]) {
            error(`ID '${id}' does not exist in database '${this.path}'.`);
            return;
        }

        db.data[id] = data;
        try {
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Wrote data to database '${this.path}'`);
        } catch (err) {
            major_error(`Failed to write data to database '${this.path}': ${err.message}`);
            return;
        }

        return id;
    }

    /**
     * Read data from the database with a given id
     * @param {integer} id the id to read
     * @returns the data if successful, nothing if not
     */
    read(id) {
        if (!fs.existsSync(this.path)) {
            major_error(`Database '${this.path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            major_error(`Failed to read database '${this.path}': ${err.message}`);
            return;
        }

        if (!db.data[id]) {
            error(`ID '${id}' does not exist in database '${this.path}'.`);
            return;
        }

        return db.data[id];
    }

    /**
     * Delete data from the database with a given id
     * @param {integer} id the id to delete 
     * @returns true if successful, false if not
     */
    delete(id) {
        if (!fs.existsSync(this.path)) {
            major_error(`Database '${this.path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            major_error(`Failed to read database '${this.path}': ${err.message}`);
            return false;
        }

        if (!db.data[id]) {
            error(`ID '${id}' does not exist in database '${this.path}'.`);
            return false;
        }

        delete db.data[id];
        try {
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Deleted data from database '${this.path}'`);
        } catch (err) {
            major_error(`Failed to delete data from database '${this.path}': ${err.message}`);
            return;
        }

        return true;
    }

    /**
     * List the database
     * @returns the entire database
     */
    list() {
        if (!fs.existsSync(this.path)) {
            major_error(`Database '${this.path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            major_error(`Failed to read database '${this.path}': ${err.message}`);
            return;
        }

        return db.data;
    }


    /**
     * Clears the database
     * @returns nothing
     */
    clear() {
        if (!fs.existsSync(this.path)) {
            major_error(`Database '${this.path}' does not exist.`);
            return;
        }

        let db;
        try {
            const dbfile = fs.readFileSync(this.path);
            db = JSON.parse(dbfile);
        } catch (err) {
            major_error(`Failed to read database '${this.path}': ${err.message}`);
            return;
        }

        db.data = {};
        try {
            fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
            success(`Cleared database '${this.path}'`);
        } catch (err) {
            major_error(`Failed to clear database '${this.path}': ${err.message}`);
            return;
        }
    }

    /**
     * Check if the database exists
     * @returns returns true if the database exists, false if not
     */
    exists() {
        return fs.existsSync(this.path);
    }
}

module.exports = JSONdb;