FROM node:lts

WORKDIR /app
COPY ./ ./

EXPOSE 2025
WORKDIR /app/Server
RUN npm i
ENTRYPOINT [ "node", "server.js" ]