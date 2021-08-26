const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser')
const fs = require('fs')



// Open sqlite connection
const db = new sqlite3.Database('database/people.db');

// Run these commands sychronously
db.serialize(err => {

  // Delete table if exists
  db.run(`
    DROP TABLE IF EXISTS people;
  `)


  // Init table
  db.run(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY,
      name TEXT,
      age INTEGER,
      latitude REAL,
      longitude REAL,
      monthlyIncome INTEGER,
      experienced INTEGER
    );
  `
  );


  // Populate
  const insert_stmt = db.prepare(`
      INSERT INTO people (
        name,
        age,
        latitude,
        longitude,
        monthlyIncome,
        experienced
      ) VALUES (
        ?, ?, ?, ?, ?, ?
      )
  `)

  fs.createReadStream('database/data.csv')
      .pipe(csv())
      .on('data', data => {

        // Insert
        insert_stmt.run(Object.values(data))

      })
      .on('end', _ => {
        console.log(`Done.`)
      })

});

db.close();