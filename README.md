# Tech Radar

Status : Alpha - WIP

Simple Web Application to enable community technology management within your organisation.

* Add technologies that you are interested in and associate with categories and projects
* Get your users to comment on the technologies they have experience in
* Vote on whether they think they should be adopted, trialled or avoided.  
* Users with the correct permissions can then set the 'offical' status with a rationale for each technology

The application is still very much in development both in terms of the standard and planned features.

## Not yet implemented

* Delete things (technologies, comments, users, projects)
* Update things (technologies, comments, users, projects)
* Assign technology to project

## Planned future features

* Stack builder
  * Associate a number of trechnologies into a 'stack' 
  * View reports/comments for each technology in one place
  * Add comments on the 'stack' as a whole

* Trending
  * Show the status of technologies over time
  * Status changes
  * When did users vote and the status
  * When did projects adopt


## Design

TechRadar is a Web Application devleoped using NodeJS, Passport, Bootstrap and PostgreSQL.  
It consists of two components:

1. Web Application 
2. REST Services



## Pre-requisites

* NodeJS
* PostgreSQL database (other databases are available and will probably work with small changes to the schema)

## Installation

Installation is as follows:

1. Provision a node environment and PostgreSQL database
2. Define the following environment variables; either by creating a process.env in the root directory or defining standard environment vairables
3. Deploy code to target environment
4. Run 'database/dninit.js' to create all the required tables
5. Run 'database/dbtestdata.js' to create some test data if required
6. Run 'server.js' :)

a case of deploying the code to your preferred NodeJS environment (personally I use OpenShift and Heroku); and providing two




