#!/usr/bin/env bash
node node_modules/db-migrate/bin/db-migrate up
node database/dbtestData.js