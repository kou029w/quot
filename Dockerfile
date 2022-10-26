FROM postgrest/postgrest:v10.0.0@sha256:db9dd042f5a4f7528b09723e08434b1ffadabeec8079e33ff38ebd8273177100 AS api
FROM amacneil/dbmate:1.16@sha256:7a93421be89475d1d7daebaa39c1627b2cead94d49e03d0afe689abb8a40175c AS dbmate
FROM node:19.0.0-alpine@sha256:7eaaf14ed8b7cc1d716b965bff7554d7d2e1127558ee8108d3844dc3a1122234
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
