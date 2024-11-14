FROM node:20-alpine

LABEL maintainer = "Jonathan Dawe <jonwe@bas.ac.uk>"

# Setup project
WORKDIR /usr/src/app

# Copy configuration files first
COPY package*.json tsconfig*.json eslint.config.mjs /usr/src/app/
COPY panda.config.ts /usr/src/app/
COPY panda.config/ /usr/src/app/panda.config/

# Install dependencies with caching and skip husky install
ENV HUSKY=0
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Copy remaining app files
COPY . .

# Expose the port the app will run on
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]
