#!/bin/sh
set -e
dbmate --url "${PGRST_DB_URI}" --wait up
exec "$@"
