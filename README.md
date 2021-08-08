# bixie-indego-challenge

Bixie Technical Interview Test.
This repo is basically intended for the Bixie technical task
to prove technical knowledge and problem solving ability in nodejs.

## It has been hosted on Heroku with free plan at :

#### https://bixie-indego-challenge.herokuapp.com/

## Following are the main objectives :

### 1) Snapshot of all stations at a specified time

#### https://bixie-indego-challenge.herokuapp.com/api/v1/stations/?at=2021-08-08T15:00:00

### 2) Snapshot of one station at a specific time

#### https://bixie-indego-challenge.herokuapp.com/api/v1/stations/3008?at=2021-08-08T15:00:00

### 3) Snapshots of one station over a range of times

#### https://bixie-indego-challenge.herokuapp.com/api/v1/stations/3008?from=2021-08-07T11:00:00&to=2021-08-07T23:00:00&frequency=daily

#### https://bixie-indego-challenge.herokuapp.com/api/v1/stations/3008?from=2021-08-07T11:00:00&to=2021-08-07T23:00:00&frequency=hourly

## It includes Data managing from :

- [Indego](https://www.rideindego.com) API
- [Open Weather Map API](https://openweathermap.org/current)

It includes a _CRON JOB_ which saves data from these API's to postgres DB on Heroku at certain interval of time.

# An Example of Node.js, Express.js and Postgres RESTful API

#### To run locally:

- Clone this repo
- Run `npm install`
- Run `npm start` || `npm run serve`

#### `.env` File includes :

```
DB_NAME= XXX
DB_USER= XXX
DB_PASSWORD= XXX
DB_HOST= XXX
URI= XXX
OPEN_WEATHER_API_KEY= XXX
```
