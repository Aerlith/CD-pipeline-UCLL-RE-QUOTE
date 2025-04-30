FROM node:lts

WORKDIR /app
COPY ./ ./

WORKDIR /app/server
RUN npm i
ENTRYPOINT [ "node", "server.js" ]