FROM node:erbium-alpine

LABEL maintainer = "Felix Fennell <felnne@bas.ac.uk>"

# Setup project
WORKDIR /usr/src/app

# Setup project dependencies
COPY package.json .babelrc /usr/src/app/
RUN yarn install
