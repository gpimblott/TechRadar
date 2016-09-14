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

## Configuration

The following environment variables can be set
COOKIE_KEY = The secret key to use for cookie encryption - uses an insecure value if not defined
GOOGLE_ID = Google Analytics tracking code. GA is turned off if not defined

To enable Azure AD sign-in, set the following environment variables:
 
`AZURE_IDENTITY_METADATA=https://login.microsoftonline.com/YOUR_TENANT_NAME_OR_ID/.well-known/openid-configuration`

`AZURE_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxx`

`AZURE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx=`

`AZURE_RETURN_URL=https://xxxxxxxxxxx.com/auth/openid/return`

To learn more about the above values, click [here](https://azure.microsoft.com/en-us/documentation/articles/active-directory-b2c-reference-oidc/#get-a-token).
Additional Azure AD settings can be found in [configAzureAD.js](utils/configAzureAD.js)

## Installation

Installation is as follows:

1. Provision a node environment and PostgreSQL database
2. Define the following environment variables; either by creating a process.env in the root directory or defining standard environment variables
   * DATABASE_URL
3. Deploy code to target environment
4. Run `database/runMigrations.js up` to create all the required tables
5. Run `database/dbtestdata.js` to create some test data if required
6. Use `npm test` to run unit tests.
7. Run `node server.js | bunyan` :)

Deploying the code to your preferred NodeJS environment (personally I use OpenShift and Heroku)




