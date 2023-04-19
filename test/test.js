const JSONdb = require('../lib/index.js');

const db = new JSONdb();
if (!db.exists('test/test.json')) {
    db.init('test/test.json', 'test', 'test');
}
db.append('test/test.json', ["apples", "oranges", "bananas"]);