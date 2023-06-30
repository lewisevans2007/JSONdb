# JSONdb

Create databases using JSON

## Usage

```js
const JSONdb = require('@lewisevans2007/jsondb');

const db = new JSONdb('example.json');

// Initialize a new database
// db.init(name, description)
db.init('example database', 'This is an example database');

// Append data to the database
// db.append(data, id=NaN)
db.append(["A", "B", "C"])
// If you want to specify an id, you can do so
db.append(["A", "B", "C"], 1)
// If the id already exists, JSONdb will throw a warning and set a id that doesn't exist

// Write to a specific id
// db.write(id, data)
db.write(1, ["A", "B", "C"])

// Read from a specific id
// db.read(id)
db.read(1)

// Delete a specific id
// db.delete(id)
db.delete(1)

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