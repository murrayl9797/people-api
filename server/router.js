/**********************************/
/** Dependencies + initialization */
/**********************************/
const { Router } = require("express");
const { query, oneOf, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();


const router = Router();
const db = new sqlite3.Database("database/people.db");


const SCORE_PRECISION = 3;
const RESULT_LENGTH = 10;
const VALID_PARAMS = [
  "age",
  "latitude",
  "longitude",
  "monthlyIncome",
  "experienced"
];


/**********************************/
/********* Ping Route *************/
/**********************************/
router.get("/ping", (req, res) => {

  res.status(200).send({
    "data": "Server is live!"
  });
});



/**********************************/
/********* Main route *************/
/**********************************/
router.get(
  "/people-like-you",
  // Validation Middleware
  [
    query("age").optional().isInt({
      "min": 0
    }),
    query("latitude").optional().isFloat({
      "min": -90.0,
      "max": 90.0
    }),
    query("longitude").optional().isFloat({
      "min": -180.0,
      "max": 180.0
    }),
    query("monthlyIncome").optional().isFloat({
      "min": 0.0
    }),
    query("experienced").optional().isIn(["true", "false"])
  ]
  , (req, res) => {


  try {
    /**********************************/
    /******* Request validation *******/
    /**********************************/
    // If express-validator found error, throw it
    validationResult(req).throw();

    // Parse query params
    const {
      age,
      latitude,
      longitude,
      monthlyIncome,
      experienced
    } = req.query

    // If no params, error
    if (JSON.stringify(req.query) == "{}") {

      res.status(404).send({
        "message": "Please send at least one of these query parameters!",
        "validParams": VALID_PARAMS
      });

      return null;
    }

    // If unknown param
    for (let param in req.query) {

      if (!VALID_PARAMS.includes(param)) {
        res.status(404).send({
          "message": "Please make sure you only send valid parameters",
          "invalidParam": param,
          "validParams": VALID_PARAMS
        });

        return null;

      }
    }


    /**********************************/
    /***** Structure query string *****/
    /**********************************/
    const nParams = Object.values(req.query).length;

    // Age
    const ageStr = age ? (
      `(1.0 - abs(${age} - age) / (82.0))`
    ) : "0.0";

    // Monthly Income
    const incomeStr = monthlyIncome ? (
      `(1.0 - abs(${monthlyIncome} - monthlyIncome) / (17000.0))`
    ) : "0.0";

    // Experienced
    const experiencedStr = experienced ? (
      `(1.0 - abs(${experienced} - experienced) / (1.0))`
    ) : "0.0";

    let queryString = `
        SELECT *,
        round(
            (
              ${ageStr} +
              ${incomeStr} +
              ${experiencedStr}
            ) / ?
          , ${SCORE_PRECISION}) as score
        FROM people
        ORDER BY score DESC
        LIMIT ${RESULT_LENGTH}
    `;

    /**********************************/
    /******** Hit the Sqlite DB *******/
    /**********************************/
    db.all(queryString, [ nParams ]
    , (err, rows) => {
      if (err) {

        // Error querying
        console.log(`Error: ${err}`);
        res.statusStatus(500);

      } else {

        // Successful query
        res.status(200).send({
          "peopleLikeYou": rows.filter(
            p => p.score > 0
          ).map(
            p => {
              p.experienced = p.experienced == 1 ? "true" : "false";
              delete p.id;

              return p;
          })
        });

      };
    });

  } catch(err) {

    /*******************************************/
    /*** Handle error from express-validator ***/
    /*******************************************/
    console.log("Error from express-validator: ", err);
    res.status(404).send(err);

  }

});



// Export Router
module.exports = router;