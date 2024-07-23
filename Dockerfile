# FROM node:20-alpine3.18
FROM debian:10

LABEL org.opencontainers.image.source=https://github.com/OWNER/REPO

RUN apt-get update -yq \
&& apt-get install curl gnupg -yq \
&& curl -sL https://deb.nodesource.com/setup_18.x | bash \
&& apt-get install nodejs -yq \
&& apt-get clean -y

ADD give-and-collect /app/

WORKDIR /app

RUN npm install
RUN npm run build

EXPOSE 3000

CMD npm run start