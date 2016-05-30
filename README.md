# [Tech Radar](http://gpimblott.github.io/TechRadar/)

Main documentation is located here -> http://gpimblott.github.io/TechRadar/

Web Application to enable community technology management within your organisation.

* Add technologies that you are interested in and associate with categories and projects
* Get your users to comment on the technologies
* Vote on whether they think they should be adopted, trialed or avoided.  
* Users with the correct permissions can then set the 'official' status with a rationale for each technology

The implementation is extremely flexible with all values (e.g. status values) changable in the data and via the user interface.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy) (Default credentials - username:admin password:letmein)

## Planned future features

* Trending
  * Show the status of technologies over time
  * Status changes
  * When did users vote and the status
  * When did projects adopt

* Supplier index
 * Which suppliers have we used and our verdict

## Design

TechRadar is a Web Application developed using NodeJS, Passport, Bootstrap and PostgreSQL.  
It consists of two layers:

1. Web Layers 
2. API REST Services

The web application calls the API REST services using ajax.

## Pre-requisites

* NodeJS
* PostgreSQL database (other databases are available and will probably work with small changes to the schema)

## Installation

Installation is as follows:

1. Provision a node environment and PostgreSQL database
2. Define the following environment variables; either by creating a process.env in the root directory or defining standard environment variables
   * DATABASE_URL
3. Deploy code to target environment
4. Run `database/runMigrations.js up` to create all the required tables
5. Run `database/dbtestdata.js` to create some test data if required
6. Use `npm test` to run unit tests.
7. Run `server.js` :)

Deploying the code to your preferred NodeJS environment (personally I use OpenShift and Heroku)




