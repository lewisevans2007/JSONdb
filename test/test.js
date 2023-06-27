/* JSONdb (Testing file)
 * Create databases using JSON
 * Github: https://github.com/awesomelewis2007/JSONdb
 * By: Lewis Evans
 */

const JSONdb = require('../lib/index.js');

const db = new JSONdb('test/test.json');
if (!db.exists()) {
    db.init('test', 'test');
}
db.append(["apples", "oranges", "bananas"]);