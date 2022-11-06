FROM postgres:14

COPY ./docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d/
ENV DATABASE_HOST 127.0.0.1
ENV POSTGRES_USER root
ENV POSTGRES_PASSWORD root
ENV POSTGRES_DB fiberhome
