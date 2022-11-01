FROM postgrest/postgrest:v10.1.0@sha256:217371be5db8548a88780326522aab4698affd0e4d794d3198154ca87118b419 AS api
FROM amacneil/dbmate:1.16@sha256:7a93421be89475d1d7daebaa39c1627b2cead94d49e03d0afe689abb8a40175c AS dbmate
FROM node:19.0.0-alpine@sha256:1a04e2ec39cc0c3a9657c1d6f8291ea2f5ccadf6ef4521dec946e522833e87ea
RUN apk add --no-cache supervisor
COPY --from=api /bin/postgrest /usr/bin/
COPY --from=dbmate /usr/local/bin/dbmate /usr/bin/
COPY ./db ./db
COPY ./app ./app
RUN npm --prefix app ci --omit=dev
COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
COPY ./supervisord.conf /
CMD ["supervisord", "-c", "/supervisord.conf"]
