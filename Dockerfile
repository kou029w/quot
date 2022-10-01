FROM postgrest/postgrest:v10.0.0@sha256:db9dd042f5a4f7528b09723e08434b1ffadabeec8079e33ff38ebd8273177100 AS api
FROM amacneil/dbmate:1.15@sha256:8fb25de3fce073e39eb3f9411af0410d0e26cc6d120544a7510b964e218abc27 AS dbmate
FROM node:18.10.0-alpine@sha256:304e707e9283ac64af3bae2a8d6b8b16dfe00d91f739d80015bd0b74147c6840
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
