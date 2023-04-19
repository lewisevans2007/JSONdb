# JSONdb

Create databases using JSON

## Usage

```js
const JSONdb = require('jsondb');

const db = new JSONdb();

// Initialize a new database
// db.init(path, name, description)
db.init('example.json', 'example database', 'This is an example database');

// Append data to the database
// db.append(path, data, id=NaN)
db.append('example.json', ["A", "B", "C"])
// If you want to specify an id, you can do so
db.append('example.json', ["A", "B", "C"], 1)
// If the id already exists, JSONdb will throw a warning and set a id that doesn't exist

// Write to a specific id
// db.write(path, id, data)
db.write('example.json', 1, ["A", "B", "C"])

// Read from a specific id
// db.read(path, id)
db.read('example.json', 1)

// Delete a specific id
// db.delete(path, id)
db.delete('example.json', 1)

// List all ids and their data
// db.list(path)
db.list('example.json')

// Clear the database
// db.clear(path)
db.clear('example.json')

// Check if the database exists
// db.exists(path)
db.exists('example.json')
```