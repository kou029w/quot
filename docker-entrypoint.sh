#!/bin/sh
set -e
dbmate --wait up
export PGRST_DB_URI="${PGRST_DB_URI:-${DATABASE_URL}}"
export PGRST_DB_SCHEMA="${PGRST_DB_SCHEMA:-public}"
export PGRST_DB_ANON_ROLE="${PGRST_DB_ANON_ROLE:-guest}"
export PGRST_JWT_SECRET="${QUOT_JWK}"
exec "$@"
