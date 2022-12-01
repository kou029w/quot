FROM postgrest/postgrest:v10.1.1@sha256:93ef9468e5da753fdf181b0968a0527eaf8de91231804269e4636e8c2626a6e5 AS api
FROM amacneil/dbmate:1.16@sha256:7a93421be89475d1d7daebaa39c1627b2cead94d49e03d0afe689abb8a40175c AS dbmate
FROM node:19.2.0-alpine@sha256:80844b6643f239c87fceae51e6540eeb054fc7114d979703770ec75250dcd03b
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
