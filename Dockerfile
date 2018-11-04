FROM node:8-alpine

COPY package-lock.json /server/package-lock.json
COPY package.json /server/package.json
WORKDIR /server

RUN apk --update add --no-cache python make g++
RUN if [ "x$NODE_ENV" == "xproduction" ]; then npm install --production ; else npm install ; fi

COPY . .

EXPOSE 4000
