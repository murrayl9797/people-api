# People API

This is the "People Like You" API for the Bambu backend challenge. Please find my deployed API at the following url:

https://bambu.liammurray.io/people-like-you

Original challenge can be found at: https://bitbucket.org/bambudeveloper/backend-challenge-v2/src/master/

# Tech Stack


* NodeJS
* ExpressJS
* Serverless
* Lambda
* SQLite
* Docker
* R


# Development Process


## 1. Handling the `score` calculation

The first step was looking at the data and figuring out how to calculate the `score` variable for each data point based on a requests search parameters. Since the `score` variable needed to be between `0` and `1`, I spent some time thinking about how to calculate the `score` for each optional variable passed and ended up with the following equation:

`1 - (|v_1 - v_2| / max - min)`

Where `v_1` is the value being sent to the API and `v_2` is the value of a given person for that attribute. `max` and `min` are the maximum and minimum values calculated for that given column (calculated using the `clean.R` file). I sum each of these values for a given attribute and divide by the number of parameters sent by a single request which means each of values are weighted the same. These equations are implemented through a combination of SQL and JS in `server/router.js`.


## 2. Decisions on Tech Stack + Deployment process

I went with an ExpressJS application that used SQLite to keep the deployment resources at a minimum. I've used a framework called Zappa to deploy Django REST API's on Lambda before, so decided to try out Serverless to deploy this NodeJS based API on Lambda.

After trying to run the API on Lambda, there seemed to be issues with the `sqlite3` Node module being able to run. I realized this was a similar issue I had when developing with Django, where the binaries needed to run that module were OS specific, so my MacOS binaries weren't compatible with Lambda's Linux based OS. That's why I crafted a simple `Dockerfile` and `docker-compose.yml` to containerize this application and get the appropriate Linux based binaries.

To get the appropriate `node_modules`, I actually spun up a container of the application and used `docker cp` to copy them onto my file system and deploy. That would be quite annoying to do everytime, but in the future, I would likely just use a simple Circle CI pipeline to run deployment process, which would also utilize a Linux-based OS, solving that issue.


## 3. Things I Would Potentially Iterate On

Here's a high-level list of things I would work on if I were to continue improving this application:

* Load testing along with performance testing (Lambda is quite slow, but not too difficult to maintain)
* Trying a NoSQL database and seeing how performance would likely increase (DynamoDB would probably be quite a good option)
* Sorting out how to change the DB queries to handle different field weights in determining the `score` (e.g. wanting `monthlyIncome` to have a greater effect on `score` than `age`)
* Calculating `distance` as well using the Haversine formula (I was also hesitant to do this because I wasn't sure if a request could have `latitude` without `longitude` and vice versa)


# Last notes

Some final notes on the application:

* There is request checking to make sure the values of each field make sense (e.g. `age` must be a number greater than 0) which uses the `express-validator` node module
* I utilized `serverless-plugin-warmup` to send occasional requests to the API to reduce the effect of cold starts from Lambda's "serverless" nature
* Since my equations can have negative values if `v_1` and `v_2` differ more than `min` and `max`, I filter any data points that have a negative `score`