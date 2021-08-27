const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser')
const fs = require('fs')



// Open sqlite connection and start timer
const db = new sqlite3.Database('database/people.db');
const start = Date.now();


// Run these commands sychronously
db.serialize(err => {

  // Delete table if exists
  db.run(`
    DROP TABLE IF EXISTS people;
  `);

  // Initialbe table schema
  db.run(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY,
      name TEXT,
      age REAL,
      latitude REAL,
      longitude REAL,
      monthlyIncome REAL,
      experienced REAL
    );
  `
  );


  // Populate table using csv
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
  `);


  fs.createReadStream('database/people.csv')
    .pipe(csv())
    .on('data', data => {

      // Insert
      insert_stmt.run(Object.values(data));

    })
    .on('end', _ => {

      insert_stmt.finalize()
      console.log(`Done reading from csv, waiting for SQL commands to finish`);

  });

});


// Close DB connection
db.close(err => {

  // Finish timer
  const end = Date.now();
  console.log(`Finished in ${(end - start) / 1000} seconds.`);

  // Check for errors
  if (err) {
    console.err(err)
    console.log(`Error closing DB connection^^^`);
  } else {
    console.log(`Successfully closed DB connection!`);
  }

});
