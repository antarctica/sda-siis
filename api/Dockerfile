FROM python:3.6-alpine as base

LABEL maintainer="Andreas Cziferszky <ancz@bas.ac.uk>"

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV FLASK_ENV=development
ENV PYTHONPATH=/usr/src/app
ENV PYTHONUNBUFFERED 1

COPY requirements.txt requirements-dev.txt /usr/src/app/
RUN apk add --no-cache postgresql-libs libffi-dev libressl-dev python3-dev py-pip && \
    apk add --no-cache --virtual .build-deps build-base linux-headers postgresql-dev && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir -r requirements-dev.txt && \
    apk --purge del .build-deps
