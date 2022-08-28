FROM postgrest/postgrest:v10.0.0 AS api
FROM amacneil/dbmate:1.15 AS dbmate
FROM node:18.7.0-alpine
RUN apk add --no-cache supervisor
COPY --from=api /bin/postgrest /usr/bin/
COPY --from=dbmate /usr/local/bin/dbmate /usr/bin/
COPY ./db ./db
COPY ./app ./app
RUN npm --prefix app ci --production
COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
COPY ./supervisord.conf /
CMD ["supervisord", "-c", "/supervisord.conf"]
