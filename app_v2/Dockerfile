FROM node:20-alpine

LABEL maintainer = "Jonathan Dawe <jonwe@bas.ac.uk>"

WORKDIR /usr/src/app

# Copy and install dependencies first for better caching
COPY package*.json tsconfig*.json eslint.config.mjs ./
COPY panda.config.ts ./
COPY panda.config/ ./panda.config/

ENV HUSKY=0
RUN --mount=type=cache,target=/root/.npm \
    npm install

# We don't need to COPY the source code here anymore
# as it will be mounted through volumes

EXPOSE 5173

CMD ["npm", "run", "dev"]
